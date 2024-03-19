import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('app:mounted', () => {
        const firebaseConfig = {
            apiKey: "AIzaSyBLwW-yvEGHwUzsJe-WYWcje1QSDSwBGmY",
            authDomain: "itu-siapa.firebaseapp.com",
            projectId: "itu-siapa",
            storageBucket: "itu-siapa.appspot.com",
            messagingSenderId: "1021171214545",
            appId: "1:1021171214545:web:b86f688987716801a7fdf0",
            measurementId: "G-2CBEY2HBTT"
          };
          
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
    })
})