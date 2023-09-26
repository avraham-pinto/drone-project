require("dotenv").config();

exports.config = {
    PASS_DB:process.env.PASS_DB,
    USER_DB:process.env.USER_DB,
    CLOUD_NAME:process.env.CLOUD_NAME,
    CLOUD_KEY:process.env.CLOUD_KEY,
    CLOUD_SECRET:process.env.CLOUD_SECRET,
    TOKENSECRET:process.env.TOKENSECRET
}