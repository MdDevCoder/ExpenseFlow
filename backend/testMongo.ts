import mongoose from 'mongoose';

const uri1 = 'mongodb+srv://muhammadshaikh4203_db_user:AYcjiikKrsNtaycP@expenseflow.zrgtrjq.mongodb.net/?appName=ExpenseFlow';
const uri2 = 'mongodb+srv://muhammadshaikh4203_db_user:AYcjiiKkrsNtaycP@expenseflow.zrgtrjq.mongodb.net/?appName=ExpenseFlow';

async function test() {
  try {
    await mongoose.connect(uri1, { serverSelectionTimeoutMS: 2000 });
    console.log('uri1 worked');
    process.exit(0);
  } catch (e: any) { console.log('uri1 failed', e.message); }
  try {
    await mongoose.connect(uri2, { serverSelectionTimeoutMS: 2000 });
    console.log('uri2 worked');
    process.exit(0);
  } catch (e: any) { console.log('uri2 failed', e.message); }
  process.exit(1);
}
test();
