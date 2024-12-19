const jwt=require('jsonwebtoken');

module.exports={
    async generatejwttoken(data,res,req) {
        const secret = process.env.JWT_SECRET;
        return new Promise((resolve, reject) => {
          jwt.sign(
            data,
            secret,
            { expiresIn: "30 days" },
            (err, token) => {
              if (err) {
                console.log(err)
                return resolve(
                  res
                    .status(200)
                    .json({status:400,data:{},Message:"Error in generating the token"})
                );
              }
              console.log(token)
              return resolve(token);
            }
          );
        });
      },

      async validateToken(req, res, next) {
        try {
    
          const secret = process.env.JWT_SECRET;
          const token=req.headers['token']
    
          jwt.verify(token, secret, (err, data) => {
            if (err) {
                res.status(403).json({success:false,message:"Unauthorized"});
            } else {
             
              req.body.userId =data.userId
              next();
            }
          });
        } catch (error) {
            console.log(error);

          res.status(402).json({success:false,message:"Invalid JWT Token"});
        }
    }
}