import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
apiKey: "AIzaSyCBbaAuNuwQdmQbADNN8mZkN571yw56c1Y",
authDomain: "pmoadmindemo.firebaseapp.com",
projectId: "pmoadmindemo",
storageBucket: "pmoadmindemo.appspot.com",
messagingSenderId: "412317160291",
appId: "1:412317160291:web:f77a65c5ed2eb9c3d87956"
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log("Firebase has been initialized!");
} else {
  console.log("Firebase app already initialized!");
  firebaseApp = getApps()[0];
}

const storage = getStorage(firebaseApp);
export default storage;

