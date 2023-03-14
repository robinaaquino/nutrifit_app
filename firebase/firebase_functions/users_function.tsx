import { db } from '../config';
import { collection, getDocs } from "firebase/firestore";

export const getAllUsersFunction = async () => {
  let datas: any[] = [];
  const docs = await getDocs(
    collection(db, "users")
  );

  docs.forEach(
    doc => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        ...data
      })
    }
  )

  return datas;
}