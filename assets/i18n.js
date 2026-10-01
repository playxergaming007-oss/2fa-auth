(function(){
const LANGS={ru:'Русский',en:'English',es:'Español',fr:'Français',ar:'العربية'};
// ↓ Replace '#' with your real social profile links
const SOC=[
['Facebook','#','<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.300 0-3.800 1.400-3.800 3.900v2.300H7.500v3h2.700V21z"/>'],
['Instagram','#','<path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm5 2.500a4.500 4.500 0 1 1 0 9 4.500 4.500 0 0 1 0-9zm0 2a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5zM17 6.200a1.100 1.100 0 1 1 0 2.200 1.100 1.100 0 0 1 0-2.200z"/>'],
['Threads','#','<text x="12" y="18" text-anchor="middle" font-size="19" font-weight="700" font-family="Arial,sans-serif">@</text>'],
['TikTok','#','<path d="M16.500 3c.3 2.300 1.700 3.800 4 4v3c-1.500 0-2.800-.5-4-1.300V15a6 6 0 1 1-6-6v3.200a2.800 2.800 0 1 0 2.800 2.800V3z"/>'],
['Bluesky','#','<path d="M6.300 4.500C8.600 6.200 11.100 9.700 12 11.500c.9-1.800 3.400-5.300 5.700-7 1.700-1.200 4.300-2.100 4.300.8 0 .6-.3 4.800-.5 5.500-.7 2.400-3.100 3-5.300 2.700 3.800.7 4.800 2.800 2.700 5-4 4.100-5.800-1-6.200-2.300-.1-.2-.1-.3-.1-.2s0 0-.1.2c-.4 1.300-2.200 6.400-6.200 2.300-2.100-2.200-1.100-4.300 2.700-5-2.200.3-4.600-.3-5.300-2.700C2.300 10.100 2 5.900 2 5.300c0-2.900 2.600-2 4.300-.8z"/>'],
['VK','#','<text x="12" y="16.500" text-anchor="middle" font-size="12" font-weight="800" font-family="Arial,sans-serif">VK</text>'],
['Telegram','#','<path d="M21.500 4.200 2.800 11.400c-1.300.5-1.300 1.200-.2 1.500l4.800 1.500 1.800 5.600c.2.600.1.800.7.800.5 0 .7-.2 1-.5l2.300-2.300 4.800 3.500c.9.500 1.500.2 1.700-.8L22.800 5.700c.3-1.300-.5-1.900-1.300-1.500zM8.300 13.600l9.400-5.900c.4-.3.800-.1.500.2l-7.700 7-.3 3.200z"/>'],
['X','#','<path d="M17.800 3h3l-6.600 7.500L22 21h-6.100l-4.800-6.200L5.600 21h-3l7-8L2 3h6.300l4.300 5.700zm-1 16.200h1.700L7.200 4.700H5.400z"/>']
];
// Docs: "Title|paragraph|paragraph"   Pairs: "Title|Text"
const D={
ru:{title:'2FA Authenticator — генератор 2FA кодов онлайн (TOTP) без установки',desc:'Бесплатный онлайн 2FA генератор: получите TOTP-код из секретного ключа или QR-кода. Google Authenticator онлайн, без регистрации, работает в браузере.',
nav_home:'Главная',nav_tools:'Инструменты',nav_features:'Возможности',nav_faq:'FAQ',
h1:'2FA-коды онлайн: генератор TOTP по секретному ключу',sub:'Введите секретный ключ или отсканируйте QR-код — и получите 6-значный код двухфакторной аутентификации. Всё считается в вашем браузере, ключи никуда не отправляются.',cta:'Получить код',
tool_title:'Генератор 2FA кодов',key:'Секретный ключ',key_ph:'Например: GAXG 243E MR2X QZ...',paste:'Вставить ключ',scan:'Скан QR',token:'Активный код',copy:'Копировать код',cancel:'Отмена',scan_hint:'Наведите камеру на QR-код',
t_copied:'Скопировано',t_nocopy:'Не удалось скопировать',t_code:'Код скопирован: ',t_genfail:'Код создан, но не скопирован',t_invalid:'Неверный ключ',t_clip:'Нет доступа к буферу обмена',t_enter:'Сначала введите секретный ключ',t_cam:'Нет доступа к камере',t_qrbad:'Неверный ключ в QR-коде',
f_title:'Возможности',
f1:'Работает в браузере|Код считается локально через Web Crypto. Секретный ключ не покидает ваше устройство.',
f2:'Сканирование QR|Наведите камеру на QR-код или вставьте ссылку otpauth:// — ключ извлечётся автоматически.',
f3:'Как Google Authenticator|Стандарт TOTP (RFC 6238): 6 цифр, обновление каждые 30 секунд — коды совпадают с приложением.',
f4:'Быстрое копирование|Один клик — и код в буфере обмена. Кнопка обновления сразу показывает следующий код.',
faq_title:'Частые вопросы',
q1:'Что такое 2FA-код и секретный ключ?|2FA-код — одноразовый 6-значный пароль, который меняется каждые 30 секунд. Он вычисляется из секретного ключа (Base32), который сервис выдаёт при включении двухфакторной защиты.',
q2:'Безопасно ли вводить ключ здесь?|Вычисления выполняются только в вашем браузере, на сервер ничего не отправляется. Не используйте инструмент на чужих и недоверенных устройствах.',
q3:'Чем это отличается от Google Authenticator?|Алгоритм тот же (TOTP), поэтому коды совпадают. Здесь ничего не нужно устанавливать, но хранение ключа — на вас.',
q4:'Почему код не подходит?|Проверьте ключ и время на устройстве: расхождение больше 30 секунд даёт неверный код.',
nav_guide:'Инструкция',ft_guide:'Как пользоваться',g_title:'Как пользоваться 2FA-генератором',g_intro:'Короткая пошаговая инструкция: от получения секретного ключа до ввода 6-значного кода.',g_video:'Видеоинструкция',g_soon:'Видео скоро появится',g_steps:'Пошаговая инструкция',g_open:'Открыть генератор',gs1:'Получите секретный ключ|В настройках безопасности нужного сервиса включите двухфакторную защиту и выберите «Приложение-аутентификатор». Сервис покажет QR-код и текстовый секретный ключ.',gs2:'Введите ключ или отсканируйте QR|Вставьте ключ в поле «Секретный ключ» (кнопка «Вставить ключ») или нажмите «Скан QR» и наведите камеру на QR-код.',gs3:'Получите код|Справа появится 6-значный код. Он обновляется каждые 30 секунд, цветная шкала показывает оставшееся время.',gs4:'Скопируйте и введите код|Нажмите «Копировать код» и вставьте его на сайте сервиса. Если до смены осталось мало времени, нажмите кнопку обновления — она покажет следующий код.',gs5:'Сохраните ключ в надёжном месте|Сайт не хранит ваш ключ. Запишите его в менеджере паролей: при потере доступа восстановить его будет нельзя.',ft_about:'О нас',ft_contact:'Контакты',ft_privacy:'Политика конфиденциальности',ft_disclaimer:'Отказ от ответственности',ft_terms:'Условия использования',follow:'Мы в соцсетях',rights:'Все права защищены.',
about:'О нас|2FA Auths — бесплатный онлайн-инструмент для генерации одноразовых TOTP-кодов.|Мы делаем двухфакторную аутентификацию проще: без установки приложений и без регистрации.',
contact:'Контакты|Вопросы, предложения и сообщения об ошибках — пишите на support@2faauth.org.|Мы отвечаем в течение нескольких рабочих дней.',
privacy:'Политика конфиденциальности|Секретные ключи и коды обрабатываются только в вашем браузере и не отправляются и не хранятся на нашем сервере.|Мы можем использовать обезличенную аналитику и файлы cookie для улучшения сайта. Выбранный язык хранится в localStorage вашего браузера.|Используя сайт, вы соглашаетесь с этой политикой.',
disclaimer:'Отказ от ответственности|Инструмент предоставляется «как есть», без каких-либо гарантий.|Вы сами отвечаете за хранение секретных ключей и доступ к своим аккаунтам. Мы не несём ответственности за потерю доступа или ущерб от использования сервиса.',
terms:'Условия использования|Используя сайт, вы соглашаетесь применять его только в законных целях и только для собственных аккаунтов.|Запрещено использовать сервис для доступа к чужим аккаунтам. Мы вправе изменять сайт и эти условия без предварительного уведомления.'},
en:{title:'2FA Authenticator — Free Online 2FA Code Generator (TOTP)',desc:'Free online 2FA generator: get a TOTP code from a secret key or QR code. Google Authenticator online, no sign-up, runs in your browser.',
nav_home:'Home',nav_tools:'Tools',nav_features:'Features',nav_faq:'FAQ',
h1:'Online 2FA codes: TOTP generator from a secret key',sub:'Enter a secret key or scan a QR code to get your 6-digit two-factor authentication code. Everything is calculated in your browser — keys are never sent anywhere.',cta:'Get my code',
tool_title:'2FA code generator',key:'Secret key',key_ph:'e.g. GAXG 243E MR2X QZ...',paste:'Paste key',scan:'Scan QR',token:'Active code',copy:'Copy code',cancel:'Cancel',scan_hint:'Point the camera at a QR code',
t_copied:'Copied',t_nocopy:'Could not copy',t_code:'Code copied: ',t_genfail:'Generated — copy failed',t_invalid:'Invalid key',t_clip:'Clipboard permission denied',t_enter:'Enter a secret key first',t_cam:'Camera permission denied',t_qrbad:'Invalid key in QR code',
f_title:'Features',
f1:'Runs in your browser|Codes are computed locally with Web Crypto. Your secret key never leaves your device.',
f2:'QR scanning|Point your camera at a QR code or paste an otpauth:// link — the key is extracted automatically.',
f3:'Works like Google Authenticator|TOTP standard (RFC 6238): 6 digits, refreshed every 30 seconds, matching your app.',
f4:'One-click copy|One tap puts the code on your clipboard. The refresh button shows the next code instantly.',
faq_title:'Frequently asked questions',
q1:'What is a 2FA code and a secret key?|A 2FA code is a one-time 6-digit password that changes every 30 seconds. It is calculated from a Base32 secret key that a service gives you when you enable two-factor protection.',
q2:'Is it safe to enter my key here?|All calculations happen in your browser and nothing is sent to a server. Still, avoid using the tool on shared or untrusted devices.',
q3:'How is this different from Google Authenticator?|The algorithm is the same (TOTP), so the codes match. Nothing to install here, but you are responsible for storing the key.',
q4:'Why is my code rejected?|Check the key and your device clock: a drift of more than 30 seconds produces wrong codes.',
nav_guide:'Guide',ft_guide:'How to use',g_title:'How to use the 2FA generator',g_intro:'A short step-by-step guide: from getting your secret key to entering the 6-digit code.',g_video:'Video guide',g_soon:'Video coming soon',g_steps:'Step-by-step guide',g_open:'Open the generator',gs1:'Get your secret key|In the security settings of your service, enable two-factor authentication and choose "Authenticator app". The service shows a QR code and a text secret key.',gs2:'Enter the key or scan the QR|Paste the key into the "Secret key" field ("Paste key" button) or tap "Scan QR" and point the camera at the QR code.',gs3:'Get your code|A 6-digit code appears on the right. It refreshes every 30 seconds, and the colored bar shows the time left.',gs4:'Copy and enter the code|Tap "Copy code" and paste it on the service\'s website. If little time is left, press the refresh button to see the next code.',gs5:'Store your key safely|This site does not store your key. Save it in a password manager — if you lose access, it cannot be recovered.',ft_about:'About us',ft_contact:'Contact us',ft_privacy:'Privacy policy',ft_disclaimer:'Disclaimer',ft_terms:'Terms and conditions',follow:'Follow us',rights:'All rights reserved.',
about:'About us|2FA Auths is a free online tool for generating one-time TOTP codes.|We make two-factor authentication simpler: no app to install and no sign-up.',
contact:'Contact us|For questions, suggestions or bug reports, write to support@2faauth.org.|We reply within a few business days.',
privacy:'Privacy policy|Secret keys and codes are processed only in your browser. They are not sent to or stored on our server.|We may use anonymous analytics and cookies to improve the site. Your language choice is kept in your browser\'s localStorage.|By using the site you agree to this policy.',
disclaimer:'Disclaimer|The tool is provided "as is", without warranties of any kind.|You are responsible for storing your secret keys and for access to your accounts. We are not liable for loss of access or any damage from using the service.',
terms:'Terms and conditions|By using this site you agree to use it lawfully and only for your own accounts.|Using the service to access accounts that are not yours is prohibited. We may change the site and these terms without prior notice.'},
es:{title:'2FA Authenticator — Generador de códigos 2FA online gratis (TOTP)',desc:'Generador 2FA online gratuito: obtén un código TOTP desde una clave secreta o un código QR. Google Authenticator online, sin registro.',
nav_home:'Inicio',nav_tools:'Herramientas',nav_features:'Funciones',nav_faq:'FAQ',
h1:'Códigos 2FA online: generador TOTP con clave secreta',sub:'Introduce una clave secreta o escanea un código QR y obtén tu código de 6 dígitos de autenticación en dos pasos. Todo se calcula en tu navegador; las claves no se envían a ningún sitio.',cta:'Obtener código',
tool_title:'Generador de códigos 2FA',key:'Clave secreta',key_ph:'Ej.: GAXG 243E MR2X QZ...',paste:'Pegar clave',scan:'Escanear QR',token:'Código activo',copy:'Copiar código',cancel:'Cancelar',scan_hint:'Apunta la cámara a un código QR',
t_copied:'Copiado',t_nocopy:'No se pudo copiar',t_code:'Código copiado: ',t_genfail:'Generado, pero no se copió',t_invalid:'Clave no válida',t_clip:'Permiso del portapapeles denegado',t_enter:'Introduce primero una clave',t_cam:'Permiso de cámara denegado',t_qrbad:'Clave no válida en el QR',
f_title:'Funciones',
f1:'Funciona en el navegador|El código se calcula localmente con Web Crypto. Tu clave secreta nunca sale de tu dispositivo.',
f2:'Escaneo de QR|Apunta la cámara a un QR o pega un enlace otpauth:// y la clave se extrae sola.',
f3:'Como Google Authenticator|Estándar TOTP (RFC 6238): 6 dígitos que cambian cada 30 segundos, iguales a los de tu app.',
f4:'Copia con un clic|Un toque y el código está en el portapapeles. El botón de actualizar muestra el siguiente código.',
faq_title:'Preguntas frecuentes',
q1:'¿Qué es un código 2FA y una clave secreta?|Un código 2FA es una contraseña de un solo uso de 6 dígitos que cambia cada 30 segundos. Se calcula a partir de una clave secreta Base32 que te da el servicio al activar la verificación en dos pasos.',
q2:'¿Es seguro introducir mi clave aquí?|Los cálculos se hacen solo en tu navegador y no se envía nada a un servidor. Aun así, evita usarlo en dispositivos ajenos o no fiables.',
q3:'¿En qué se diferencia de Google Authenticator?|El algoritmo es el mismo (TOTP), así que los códigos coinciden. Aquí no se instala nada, pero tú guardas la clave.',
q4:'¿Por qué no funciona mi código?|Revisa la clave y la hora del dispositivo: un desfase de más de 30 segundos da códigos incorrectos.',
nav_guide:'Guía',ft_guide:'Cómo usar',g_title:'Cómo usar el generador 2FA',g_intro:'Una guía breve paso a paso: desde obtener la clave secreta hasta introducir el código de 6 dígitos.',g_video:'Guía en vídeo',g_soon:'Vídeo próximamente',g_steps:'Guía paso a paso',g_open:'Abrir el generador',gs1:'Obtén tu clave secreta|En los ajustes de seguridad del servicio, activa la verificación en dos pasos y elige «App de autenticación». El servicio mostrará un código QR y una clave secreta en texto.',gs2:'Introduce la clave o escanea el QR|Pega la clave en el campo «Clave secreta» (botón «Pegar clave») o pulsa «Escanear QR» y apunta la cámara al código.',gs3:'Obtén tu código|A la derecha aparece un código de 6 dígitos. Cambia cada 30 segundos y la barra de color muestra el tiempo restante.',gs4:'Copia e introduce el código|Pulsa «Copiar código» y pégalo en la web del servicio. Si queda poco tiempo, pulsa el botón de actualizar para ver el siguiente código.',gs5:'Guarda tu clave en un lugar seguro|Este sitio no guarda tu clave. Anótala en un gestor de contraseñas: si pierdes el acceso, no se puede recuperar.',ft_about:'Sobre nosotros',ft_contact:'Contacto',ft_privacy:'Política de privacidad',ft_disclaimer:'Aviso legal',ft_terms:'Términos y condiciones',follow:'Síguenos',rights:'Todos los derechos reservados.',
about:'Sobre nosotros|2FA Auths es una herramienta online gratuita para generar códigos TOTP de un solo uso.|Hacemos más sencilla la autenticación en dos pasos: sin instalar apps y sin registro.',
contact:'Contacto|Para preguntas, sugerencias o errores, escribe a support@2faauth.org.|Respondemos en unos pocos días laborables.',
privacy:'Política de privacidad|Las claves secretas y los códigos se procesan solo en tu navegador; no se envían ni se guardan en nuestro servidor.|Podemos usar analítica anónima y cookies para mejorar el sitio. El idioma elegido se guarda en el localStorage de tu navegador.|Al usar el sitio aceptas esta política.',
disclaimer:'Aviso legal|La herramienta se ofrece «tal cual», sin garantías de ningún tipo.|Eres responsable de guardar tus claves secretas y del acceso a tus cuentas. No respondemos por la pérdida de acceso ni por daños derivados del uso del servicio.',
terms:'Términos y condiciones|Al usar este sitio aceptas hacerlo de forma legal y solo con tus propias cuentas.|Está prohibido usar el servicio para acceder a cuentas ajenas. Podemos modificar el sitio y estos términos sin previo aviso.'},
fr:{title:'2FA Authenticator — Générateur de codes 2FA en ligne gratuit (TOTP)',desc:'Générateur 2FA gratuit en ligne : obtenez un code TOTP à partir d\'une clé secrète ou d\'un QR code. Google Authenticator en ligne, sans inscription.',
nav_home:'Accueil',nav_tools:'Outils',nav_features:'Fonctionnalités',nav_faq:'FAQ',
h1:'Codes 2FA en ligne : générateur TOTP à partir d\'une clé secrète',sub:'Saisissez une clé secrète ou scannez un QR code pour obtenir votre code d\'authentification à 6 chiffres. Tout est calculé dans votre navigateur ; vos clés ne sont jamais envoyées.',cta:'Obtenir mon code',
tool_title:'Générateur de codes 2FA',key:'Clé secrète',key_ph:'Ex. : GAXG 243E MR2X QZ...',paste:'Coller la clé',scan:'Scanner QR',token:'Code actif',copy:'Copier le code',cancel:'Annuler',scan_hint:'Dirigez la caméra vers un QR code',
t_copied:'Copié',t_nocopy:'Copie impossible',t_code:'Code copié : ',t_genfail:'Code généré, copie échouée',t_invalid:'Clé invalide',t_clip:'Accès au presse-papiers refusé',t_enter:'Saisissez d\'abord une clé',t_cam:'Accès à la caméra refusé',t_qrbad:'Clé invalide dans le QR code',
f_title:'Fonctionnalités',
f1:'Fonctionne dans le navigateur|Le code est calculé localement avec Web Crypto. Votre clé secrète ne quitte jamais votre appareil.',
f2:'Scan de QR code|Visez un QR code ou collez un lien otpauth:// : la clé est extraite automatiquement.',
f3:'Comme Google Authenticator|Standard TOTP (RFC 6238) : 6 chiffres renouvelés toutes les 30 secondes, identiques à votre application.',
f4:'Copie en un clic|Un clic place le code dans le presse-papiers. Le bouton d\'actualisation affiche le code suivant.',
faq_title:'Questions fréquentes',
q1:'Qu\'est-ce qu\'un code 2FA et une clé secrète ?|Un code 2FA est un mot de passe à usage unique de 6 chiffres qui change toutes les 30 secondes. Il est calculé à partir d\'une clé secrète Base32 fournie par le service lors de l\'activation de la double authentification.',
q2:'Est-il sûr de saisir ma clé ici ?|Les calculs se font uniquement dans votre navigateur et rien n\'est envoyé à un serveur. Évitez toutefois les appareils partagés ou non fiables.',
q3:'Quelle différence avec Google Authenticator ?|L\'algorithme est le même (TOTP), donc les codes sont identiques. Rien à installer ici, mais vous gardez vous-même la clé.',
q4:'Pourquoi mon code est refusé ?|Vérifiez la clé et l\'heure de votre appareil : un décalage de plus de 30 secondes donne des codes erronés.',
nav_guide:'Guide',ft_guide:'Mode d\'emploi',g_title:'Comment utiliser le générateur 2FA',g_intro:'Un guide court, étape par étape : de la clé secrète à la saisie du code à 6 chiffres.',g_video:'Guide vidéo',g_soon:'Vidéo bientôt disponible',g_steps:'Guide étape par étape',g_open:'Ouvrir le générateur',gs1:'Obtenez votre clé secrète|Dans les paramètres de sécurité du service, activez la double authentification et choisissez « Application d\'authentification ». Le service affiche un QR code et une clé secrète en texte.',gs2:'Saisissez la clé ou scannez le QR|Collez la clé dans le champ « Clé secrète » (bouton « Coller la clé ») ou appuyez sur « Scanner QR » et visez le QR code.',gs3:'Obtenez votre code|Un code à 6 chiffres apparaît à droite. Il change toutes les 30 secondes et la barre colorée indique le temps restant.',gs4:'Copiez et saisissez le code|Appuyez sur « Copier le code » et collez-le sur le site du service. S\'il reste peu de temps, utilisez le bouton d\'actualisation pour voir le code suivant.',gs5:'Conservez votre clé en lieu sûr|Ce site ne stocke pas votre clé. Enregistrez-la dans un gestionnaire de mots de passe : en cas de perte d\'accès, elle est irrécupérable.',ft_about:'À propos',ft_contact:'Contact',ft_privacy:'Politique de confidentialité',ft_disclaimer:'Avertissement',ft_terms:'Conditions d\'utilisation',follow:'Suivez-nous',rights:'Tous droits réservés.',
about:'À propos|2FA Auths est un outil en ligne gratuit pour générer des codes TOTP à usage unique.|Nous simplifions la double authentification : aucune application à installer, aucune inscription.',
contact:'Contact|Pour toute question, suggestion ou bug, écrivez à support@2faauth.org.|Nous répondons sous quelques jours ouvrés.',
privacy:'Politique de confidentialité|Les clés secrètes et les codes sont traités uniquement dans votre navigateur ; ils ne sont ni envoyés ni stockés sur notre serveur.|Nous pouvons utiliser des statistiques anonymes et des cookies pour améliorer le site. Votre langue est conservée dans le localStorage de votre navigateur.|En utilisant le site, vous acceptez cette politique.',
disclaimer:'Avertissement|L\'outil est fourni « tel quel », sans garantie d\'aucune sorte.|Vous êtes responsable de la conservation de vos clés secrètes et de l\'accès à vos comptes. Nous déclinons toute responsabilité en cas de perte d\'accès ou de dommage lié à l\'utilisation du service.',
terms:'Conditions d\'utilisation|En utilisant ce site, vous acceptez de l\'utiliser légalement et uniquement pour vos propres comptes.|Il est interdit d\'utiliser le service pour accéder à des comptes qui ne vous appartiennent pas. Nous pouvons modifier le site et ces conditions sans préavis.'},
ar:{title:'2FA Authenticator — مولّد رموز 2FA أونلاين مجاني (TOTP)',desc:'مولّد 2FA مجاني أونلاين: احصل على رمز TOTP من المفتاح السري أو رمز QR. Google Authenticator أونلاين دون تسجيل ويعمل في المتصفح.',
nav_home:'الرئيسية',nav_tools:'الأدوات',nav_features:'المزايا',nav_faq:'الأسئلة الشائعة',
h1:'رموز 2FA أونلاين: مولّد TOTP من المفتاح السري',sub:'أدخل المفتاح السري أو امسح رمز QR لتحصل على رمز المصادقة الثنائية المكوّن من 6 أرقام. يتم الحساب كله داخل متصفحك ولا يُرسل أي مفتاح إلى أي مكان.',cta:'احصل على الرمز',
tool_title:'مولّد رموز 2FA',key:'المفتاح السري',key_ph:'مثال: GAXG 243E MR2X QZ...',paste:'لصق المفتاح',scan:'مسح QR',token:'الرمز الحالي',copy:'نسخ الرمز',cancel:'إلغاء',scan_hint:'وجّه الكاميرا نحو رمز QR',
t_copied:'تم النسخ',t_nocopy:'تعذّر النسخ',t_code:'تم نسخ الرمز: ',t_genfail:'تم التوليد لكن فشل النسخ',t_invalid:'مفتاح غير صالح',t_clip:'تم رفض إذن الحافظة',t_enter:'أدخل المفتاح السري أولاً',t_cam:'تم رفض إذن الكاميرا',t_qrbad:'مفتاح غير صالح في رمز QR',
f_title:'المزايا',
f1:'يعمل داخل المتصفح|يُحسب الرمز محلياً عبر Web Crypto ولا يغادر مفتاحك السري جهازك.',
f2:'مسح رمز QR|وجّه الكاميرا نحو رمز QR أو الصق رابط otpauth:// وسيُستخرج المفتاح تلقائياً.',
f3:'مثل Google Authenticator|معيار TOTP (RFC 6238): 6 أرقام تتجدد كل 30 ثانية وتطابق رموز تطبيقك.',
f4:'نسخ بنقرة واحدة|نقرة واحدة تنسخ الرمز إلى الحافظة، وزر التحديث يعرض الرمز التالي فوراً.',
faq_title:'الأسئلة الشائعة',
q1:'ما هو رمز 2FA والمفتاح السري؟|رمز 2FA كلمة مرور لمرة واحدة من 6 أرقام تتغير كل 30 ثانية. يُحسب من مفتاح سري بصيغة Base32 تمنحك إياه الخدمة عند تفعيل المصادقة الثنائية.',
q2:'هل إدخال مفتاحي هنا آمن؟|تتم الحسابات داخل متصفحك فقط ولا يُرسل شيء إلى أي خادم. مع ذلك تجنّب استخدام الأداة على أجهزة مشتركة أو غير موثوقة.',
q3:'ما الفرق عن Google Authenticator؟|الخوارزمية نفسها (TOTP) لذا تتطابق الرموز. لا حاجة للتثبيت هنا، لكنك مسؤول عن حفظ المفتاح.',
q4:'لماذا لا يعمل الرمز؟|تحقق من المفتاح ومن ساعة جهازك؛ فارق يزيد على 30 ثانية يعطي رموزاً خاطئة.',
nav_guide:'الدليل',ft_guide:'طريقة الاستخدام',g_title:'طريقة استخدام مولّد 2FA',g_intro:'دليل قصير خطوة بخطوة: من الحصول على المفتاح السري إلى إدخال الرمز المكوّن من 6 أرقام.',g_video:'دليل بالفيديو',g_soon:'الفيديو قريباً',g_steps:'الدليل خطوة بخطوة',g_open:'افتح المولّد',gs1:'احصل على المفتاح السري|من إعدادات الأمان في الخدمة فعّل المصادقة الثنائية واختر «تطبيق المصادقة». ستعرض الخدمة رمز QR ومفتاحاً سرياً نصياً.',gs2:'أدخل المفتاح أو امسح رمز QR|الصق المفتاح في حقل «المفتاح السري» (زر «لصق المفتاح») أو اضغط «مسح QR» ووجّه الكاميرا نحو الرمز.',gs3:'احصل على الرمز|يظهر رمز من 6 أرقام على الجانب. يتجدد كل 30 ثانية ويعرض الشريط الملوّن الوقت المتبقي.',gs4:'انسخ الرمز وأدخله|اضغط «نسخ الرمز» والصقه في موقع الخدمة. إن بقي وقت قليل فاضغط زر التحديث لرؤية الرمز التالي.',gs5:'احفظ مفتاحك في مكان آمن|هذا الموقع لا يخزّن مفتاحك. احفظه في مدير كلمات المرور، فإن فقدت الوصول لا يمكن استرجاعه.',ft_about:'من نحن',ft_contact:'اتصل بنا',ft_privacy:'سياسة الخصوصية',ft_disclaimer:'إخلاء المسؤولية',ft_terms:'الشروط والأحكام',follow:'تابعنا',rights:'جميع الحقوق محفوظة.',
about:'من نحن|2FA Auths أداة مجانية أونلاين لتوليد رموز TOTP لمرة واحدة.|نجعل المصادقة الثنائية أسهل: بلا تثبيت تطبيقات وبلا تسجيل.',
contact:'اتصل بنا|للأسئلة والاقتراحات والإبلاغ عن الأخطاء راسلنا على support@2faauth.org.|نرد خلال أيام عمل قليلة.',
privacy:'سياسة الخصوصية|تُعالَج المفاتيح السرية والرموز داخل متصفحك فقط، ولا تُرسل إلى خادمنا ولا تُخزَّن عليه.|قد نستخدم تحليلات مجهولة وملفات تعريف الارتباط لتحسين الموقع. تُحفظ لغتك المختارة في localStorage بمتصفحك.|باستخدامك الموقع فإنك توافق على هذه السياسة.',
disclaimer:'إخلاء المسؤولية|تُقدَّم الأداة «كما هي» دون أي ضمانات.|أنت المسؤول عن حفظ مفاتيحك السرية والوصول إلى حساباتك. لا نتحمل مسؤولية فقدان الوصول أو أي ضرر ناتج عن استخدام الخدمة.',
terms:'الشروط والأحكام|باستخدامك هذا الموقع توافق على استخدامه بصورة قانونية ولحساباتك الخاصة فقط.|يُمنع استخدام الخدمة للوصول إلى حسابات لا تملكها. يحق لنا تعديل الموقع وهذه الشروط دون إشعار مسبق.'}
};
let cur=localStorage.getItem('lang');if(!D[cur])cur='ru';
window.t=k=>(D[cur][k]??D.ru[k]??k);
const page=document.body.dataset.page,home=page==='home';
const el=(s,h)=>{const e=document.getElementById(s);if(e)e.innerHTML=h};
const logo='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4z"/><line x1="12" y1="14" x2="12" y2="17"/></svg>';
el('hdr','<header class="top"><div class="container"><a class="logo" href="/"><i>'+logo+'</i>2FA Auths</a><nav aria-label="Main"><a href="/#home" data-i18n="nav_home"></a><a href="/#tools" data-i18n="nav_tools"></a><a href="/#features" data-i18n="nav_features"></a><a href="/#faq" data-i18n="nav_faq"></a><a href="guide.html" data-i18n="nav_guide"></a></nav><select id="lang" aria-label="Language">'+Object.keys(LANGS).map(k=>'<option value="'+k+'">'+LANGS[k]+'</option>').join('')+'</select></div></header>');
el('ftr','<footer class="bot"><div class="container"><nav class="flinks"><a href="guide.html" data-i18n="ft_guide"></a><a href="about.html" data-i18n="ft_about"></a><a href="contact.html" data-i18n="ft_contact"></a><a href="privacy.html" data-i18n="ft_privacy"></a><a href="disclaimer.html" data-i18n="ft_disclaimer"></a><a href="terms.html" data-i18n="ft_terms"></a></nav><div class="follow" data-i18n="follow"></div><div class="social">'+SOC.map(s=>'<a href="'+s[1]+'" target="_blank" rel="noopener me" aria-label="'+s[0]+'" title="'+s[0]+'"><svg viewBox="0 0 24 24">'+s[2]+'</svg></a>').join('')+'</div><div class="copy">© '+new Date().getFullYear()+' 2FA Auths. <span data-i18n="rights"></span></div></div></footer>');
function apply(){
  const r=document.documentElement;r.lang=cur;r.dir=cur==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll('[data-ph]').forEach(e=>e.placeholder=t(e.dataset.ph));
  document.querySelectorAll('[data-pair]').forEach(e=>{const p=t(e.dataset.pair).split('|');e.firstElementChild.textContent=p[0];e.lastElementChild.textContent=p[1]});
  const doc=document.querySelector('[data-doc]');
  if(doc){const p=t(doc.dataset.doc).split('|');doc.innerHTML='<h1></h1>'+p.slice(1).map(()=>'<p></p>').join('');doc.firstChild.textContent=p[0];[...doc.querySelectorAll('p')].forEach((e,i)=>e.textContent=p[i+1]);document.title=p[0]+' — 2FA Authenticator'}
  else{const g=page==='guide';document.title=g?t('g_title')+' — 2FA Authenticator':t('title');const m=document.querySelector('meta[name=description]');if(m)m.content=t(g?'g_intro':'desc')}
  document.getElementById('lang').value=cur;
}
document.getElementById('lang').addEventListener('change',e=>{cur=e.target.value;try{localStorage.setItem('lang',cur)}catch(x){}apply()});
apply();
})();
