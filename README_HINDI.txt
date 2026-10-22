BIO STUDY HINDI SECURE — शुरुआती सेटअप (हिंदी)
=================================================

यह एक शुरुआती वेब ऐप/PWA स्टार्टर है। अभी यह आपके Firebase खाते से जुड़ा नहीं है और Firebase config भरने तथा Rules प्रकाशित करने तक काम नहीं करेगा। यह APK फ़ाइल नहीं है। पहले इसे ऑनलाइन वेब ऐप के रूप में चालू करें; उसके बाद इसे Android पर इंस्टॉल करने योग्य PWA की तरह इस्तेमाल किया जा सकता है।

इसमें क्या है
- Firebase Authentication से ईमेल/पासवर्ड लॉगिन
- Firestore में प्रति-यूज़र निजी नोट्स और MCQ
- Firestore Security Rules: केवल अपने UID का डेटा पढ़/लिख सकते हैं
- JSON बैकअप डाउनलोड
- PWA manifest और service worker (स्थिर फ़ाइलों के लिए)

महत्वपूर्ण सुरक्षा सीमा
- कोई भी ऐप 100% hack-proof नहीं है।
- Firebase client config वेबसाइट पर दिख सकती है; इसे पासवर्ड/secret न समझें।
- असली सुरक्षा Firestore Rules, Firebase Authentication और Firebase Console के सही सेटअप पर निर्भर है।
- अपना Firebase service-account key कभी इस फ़ोल्डर/वेबसाइट में न डालें।
- इस स्टार्टर में अभी ईमेल verification, password reset UI, ऐप-स्तर encryption, restore/import और server-side rate limiting शामिल नहीं हैं।
- सार्वजनिक उपयोग या कमाई से पहले सुरक्षा नियमों की जाँच और परीक्षण कराएँ।

फोन से सेटअप का आसान तरीका
1. Chrome में https://console.firebase.google.com/ खोलें और Google खाते से साइन इन करें।
2. नया Firebase project बनाएँ। बजट शून्य रखना है तो billing/paid services चालू न करें।
3. Project settings → General → Your apps → Web app जोड़ें। मिली config की values firebase-config.js में भरें।
4. Authentication → Sign-in method में Email/Password सक्षम करें।
5. Firestore Database बनाएँ।
6. Firestore Rules में firestore.rules फ़ाइल का पूरा नियम कॉपी करें और Publish करें।
7. इन फ़ाइलों को GitHub repository में रखें। GitHub Pages/किसी HTTPS static hosting से प्रकाशित करें। GitHub Pages पर private data नहीं, केवल app code रखें।
8. वेबसाइट खोलकर नया खाता बनाएँ, नोट/MCQ सेव करके जाँचें। Firestore Rules गलत हों तो ऐप डेटा नहीं पढ़ पाएगा।
9. Firebase Console में usage/budget alerts उपलब्ध हों तो सेट करें। Free tier की सीमाएँ बदल सकती हैं; Console की मौजूदा शर्तें देखें।
10. अपने नोट्स का JSON बैकअप नियमित डाउनलोड करें।

फ़ाइलें
- index.html: ऐप UI
- app.js: लॉगिन, नोट्स और MCQ
- firebase-config.js: अपनी Firebase Web config
- firestore.rules: server-side access rules
- manifest.webmanifest और sw.js: PWA install/offline static shell
- style.css: डिज़ाइन

APK के बारे में
यह फ़ोल्डर अभी APK नहीं है। पहले वेब ऐप को HTTPS पर चलाएँ और Android Chrome के मेनू से “Install app”/“Add to Home screen” देखें। यदि आपको असली APK चाहिए, तो बाद में Trusted PWA-to-APK tool या Android build workflow से अलग से बनाना होगा। केवल PWA जोड़ने से ऐप native APK नहीं बन जाता।
