module.exports = {
    "PORT": process.env.PORT || "3000",
    "DB_HOST": process.env.DB_HOST || "localhost",
    "DB_PORT": process.env.DB_PORT || "27017",
    "DB_NAME": process.env.DB_NAME || "users",
    "secret": process.env.secret || "s3cret"
}