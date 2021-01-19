import mongoose from 'mongoose'

export default async () => {
  try {
    await mongoose.connect('mongodb://localhost/koa-user-management', {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log('Database Connected')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
