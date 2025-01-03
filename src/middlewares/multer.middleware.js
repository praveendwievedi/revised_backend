/**
 * we keep multer as middleware because we are not using it everywhere so we are not putting it in 
 * utils..
 */

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
    })

const upload = multer({ storage: storage })

export {
    upload
}