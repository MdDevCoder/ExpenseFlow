import mongoose from 'mongoose';

const uri = 'mongodb+srv://muhammadshaikh4203_db_user:AYcjiikKrsNtaycP@expenseflow.zrgtrjq.mongodb.net/?appName=ExpenseFlow';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch((err: any) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
