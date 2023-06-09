import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    todoname: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);

export default Data;

// import mongoose from "mongoose";

// const todoSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     message: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamp: true,
//   }
// );

// const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

// export default Todo;
