
import cloudinary from "../config/cloud.config.js"
import File from "../model/file.model.js"
import User from "../model/auth.model.js"
export const uploadFile= async(req,res)=>{
   try{
    if(!req.file) {
            return res.status(401).json({
                success: false,
                message: 'File is required..'
            })
      }
    const {fileName} = req.body
        if(!fileName) {
             return res.status(401).json({
                success: false,
                message: 'FileName is required..'
            })
        }

    const result = await new Promise((resolve,reject)=>{
      const stream = cloudinary.uploader.upload_stream(
        {
          folder:'files',
          resource_type: 'auto'
        },
        (error,result)=>{
            if(error) {
                return reject(error)
            }else{
                return resolve(result)
            }
        }
      )
      stream.end(req.file.buffer)
    })
    const file=await File.create({
        fileName,
        fileUrl:result.secure_url,
        createdBy:req.user._id
    })

    await User.findByIdAndUpdate(req.user._id,{
        $push:{
            files:file._id
        }
    })
    return res.status(201).json({
        success:true,
        message:"File uploaded successfully",
        file
    })
    } catch(e) {
        console.log("file upload error:",e.message)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}