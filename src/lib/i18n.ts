import { useLanguage } from '@/contexts/LanguageContext'
import { useCallback } from 'react'

type Dict = Record<string, string>

const fa: Dict = {
  'common.english': 'English',
  'common.persian': 'فارسی',
  'common.home': 'خانه',
  'common.account': 'حساب',
  'common.cart': 'سبد',
  'common.orders_list': 'سفارش‌ها',

  'auth.welcome': 'به شریف‌رو خوش آمدید',
  'auth.login': 'ورود',
  'auth.register': 'ثبت‌نام',
  'auth.redirect': 'برای دسترسی به صفحه، لطفاً وارد شوید',
  'auth.password_min': 'گذرواژه باید حداقل ۸ کاراکتر باشد',
  'auth.name_required': 'نام الزامی است',
  'auth.name': 'نام و نام خانوادگی',
  'auth.email': 'ایمیل',
  'auth.password': 'گذرواژه',
  'auth.phone': 'شماره تلفن',
  'auth.student_code': 'کد دانشجویی',
  'auth.placeholder.name': 'نام و نام خانوادگی شما',
  'auth.placeholder.email': 'email@example.com',
  'auth.placeholder.password': 'گذرواژه',
  'auth.placeholder.phone': 'شماره تلفن',
  'auth.placeholder.student_code': 'کد دانشجویی',
  'auth.processing': 'در حال پردازش...',
  'auth.signin': 'ورود',
  'auth.signup': 'ثبت‌نام',
  'auth.forgot': 'گذرواژه را فراموش کرده‌اید؟',
  'auth.forgot_soon': 'بازیابی گذرواژه به‌زودی اضافه می‌شود!',
  'auth.have_no_account': 'هنوز حساب ندارید؟ ',
  'auth.have_account': 'از قبل حساب دارید؟ ',
  'auth.register_free': 'ثبت‌نام رایگان',
  'auth.signin_link': 'ورود',

  'account.title': 'حساب کاربری',
  'account.updated': 'پروفایل با موفقیت به‌روزرسانی شد',
  'account.update_failed': 'به‌روزرسانی پروفایل ناموفق بود',
  'account.name': 'نام و نام خانوادگی',
  'account.email': 'ایمیل',
  'account.studentCode': 'کد دانشجویی',
  'account.credit': 'اعتبار',
  'account.phone': 'شماره تماس',
  'account.not_set': 'تنظیم نشده',
  'account.save': 'ذخیره',
  'account.edit': 'ویرایش',
  'account.locked': 'قفل',
  'account.add_credit': 'افزودن اعتبار',
  'account.logout': 'خروج',
  'account.change_role': 'تغییر نقش',
  'account.loading': 'در حال بارگذاری...'
  ,
  'home.checking_auth': 'در حال بررسی احراز هویت...'
  ,
  'customer.filters': 'فیلترها',
  'customer.location': 'مکان',
  'customer.order_now': 'سفارش دهید',
  'customer.loading': 'در حال بارگذاری...',
  'customer.redirecting_login': 'در حال انتقال به صفحه ورود...',
  'customer.delivery_person_phone': 'تلفن شریف بر:',
  'customer.amount': 'مبلغ:',
  'customer.delivery_location': 'محل تحویل:',
  'customer.order_code': 'کد سفارش:'
  ,
  'order.success_submit': 'سفارش با موفقیت ثبت شد!'
  ,
  'cart.title': 'سبد خرید',
  'cart.empty_title': 'سبد خرید',
  'cart.empty_text': 'سبد خرید شما خالی است.',
  'cart.past_orders_title': 'سفارش‌های قبلی من',
  'cart.loading_orders': 'در حال بارگذاری سفارش‌ها...',
  'cart.no_past_orders': 'هیچ سفارش قبلی ندارید.'
  ,
  'errors.invalid_cart_data': 'اطلاعات سبد خرید نامعتبر است.',
  'errors.fetch_past_orders': 'دریافت سفارش‌های قبلی ناموفق بود.'
  ,
  'delivery.loading': 'در حال بارگذاری...',
  'delivery.login_required': 'برای دسترسی به صفحه، لطفاً وارد شوید',
  'delivery.dashboard': 'داشبورد تحویل',
  'delivery.accept_order': 'تایید سفارش',
  'delivery.order_confirmed': 'سفارش تایید شد! برای دیدن جزئیات، "لیست تحویل‌های من" را بررسی کنید.',
  'delivery.accept_failed': 'درخواست تایید سفارش ناموفق بود. لطفا دوباره تلاش کنید.'
  ,
  'delivery.no_pending': 'سفارش در حال انتظاری موجود نیست.',
  'delivery.loading_orders': 'در حال بارگذاری سفارش‌ها...',
  'delivery.select_location': 'انتخاب محل',
  'delivery.clear_filter': 'حذف فیلتر',
  'delivery.cost_min': 'حداقل',
  'delivery.cost_max': 'حداکثر',
  'delivery.verification_required_title': '⚠️ نیاز به احراز هویت',
  'delivery.verification_required_text': 'حساب شما هنوز برای پذیرش سفارش‌ها تأیید نشده است. لطفا فرآیند احراز هویت را کامل کنید.',
  'delivery.go_to_verification': 'رفتن به احراز هویت',
  'delivery.why_verification': 'چرا احراز هویت؟',
  'delivery.why_1': '✓ تضمین تحویل‌های ایمن و قابل اعتماد',
  'delivery.why_2': '✓ حفاظت از شریف گیرها و شریف برها',
  'delivery.why_3': '✓ تایید هویت دانشجویی',
  'delivery.why_4': '✓ بررسی دستی توسط تیم ادمین برای امنیت',
  'verify.title': '🎓 احراز هویت شریف بر',
  'verify.subtitle': 'مدارک خود را برای بررسی دستی توسط تیم ادمین ارسال کنید',
  'verify.info_title': '⚠️ اطلاعات مهم',
  'verify.info_text': 'احراز هویت شما به صورت دستی توسط ادمین‌ها بررسی می‌شود و ممکن است ۴۸-۲۴ ساعت زمان ببرد. پس از تأیید، به شما اطلاع داده خواهد شد.',
  'verify.student_card': 'عکس کارت دانشجویی',
  'verify.selfie': 'عکس سلفی',
  'verify.click_to_upload_student_card': 'برای بارگذاری کارت دانشجویی کلیک کنید',
  'verify.click_to_upload_selfie': 'برای بارگذاری سلفی کلیک کنید',
  'verify.click_to_change': 'برای تغییر کلیک کنید',
  'verify.hint': 'JPG, PNG یا HEIC (حداکثر ۱۰MB)',
  'verify.submit': 'ارسال برای احراز هویت',
  'verify.submitting': 'در حال ارسال...',
  'verify.please_login': 'برای دسترسی به احراز هویت، لطفاً وارد شوید.',
  'verify.need_both': 'لطفاً هر دو تصویر را بارگذاری کنید.',
  'verify.must_login': 'برای ارسال احراز هویت باید وارد شده باشید.',
  'verify.uploading': 'در حال بارگذاری مدارک...',
  'verify.student_uploaded': 'کارت دانشجویی بارگذاری شد، در حال بارگذاری سلفی...',
  'verify.creating_request': 'در حال ایجاد درخواست احراز هویت...',
  'verify.success': '✓ درخواست احراز هویت با موفقیت ثبت شد!',
  'verify.fail_prefix': 'ثبت احراز هویت ناموفق بود: ',
  'verify.status.pending': 'در انتظار بررسی',
  'verify.status.approved': 'تأیید شد',
  'verify.status.pending_msg': 'درخواست احراز هویت شما در حال بررسی توسط تیم ادمین است و معمولاً ۴۸-۲۴ ساعت زمان می‌برد. پس از تأیید به شما اطلاع داده می‌شود.',
  'verify.status.approved_msg': 'حساب شما تأیید شد! اکنون می‌توانید سفارش‌های تحویل را بپذیرید.',
  'verify.back_to_dashboard': 'بازگشت به داشبورد',
  'role.loading_user': 'در حال بارگذاری اطلاعات کاربر...'
  ,
  'role.redirecting_login': 'در حال انتقال به صفحه ورود...'
  ,
  'role.customer': 'شریف گیر'
  ,
  'role.delivery': 'شریف بر'
  ,
  'deliveries.loading': 'در حال بارگذاری...',
  'deliveries.login_required': 'برای مشاهده تحویل‌ها، لطفاً وارد شوید.',
  'deliveries.title': 'تحویل‌های من',
  'deliveries.refresh': 'به‌روزرسانی',
  'deliveries.tab.all': 'همه',
  'deliveries.tab.waiting_payment': 'در انتظار پرداخت',
  'deliveries.tab.delivering': 'در حال ارسال',
  'deliveries.tab.completed': 'تکمیل شده',
  'deliveries.none_title': 'هنوز تحویلی وجود ندارد',
  'deliveries.none_text': 'برای مشاهده، شروع به پذیرش سفارش‌ها کنید!',
  'deliveries.error_load': 'بارگیری تحویل‌ها ناموفق بود',
  'deliveries.mark_delivered_success': 'سفارش به‌عنوان تحویل‌شده علامت‌گذاری شد!',
  'deliveries.mark_delivered_failed': 'علامت‌گذاری تحویل ناموفق بود. لطفا دوباره تلاش کنید.',
  'deliveries.customer_info': 'اطلاعات شریف گیر',
  'deliveries.name': 'نام و نام خانوادگی',
  'deliveries.phone': 'تلفن',
  'deliveries.email': 'ایمیل',
  'deliveries.pickup_from': 'محل دریافت',
  'deliveries.deliver_to': 'تحویل به',
  'deliveries.order_code': 'کد سفارش',
  'deliveries.not_available': 'در دسترس نیست',
  'deliveries.price': 'قیمت',
  'deliveries.notes': 'یادداشت‌های تحویل',
  'deliveries.timeline': 'خط زمانی',
  'deliveries.timeline.placed': 'ثبت سفارش',
  'deliveries.timeline.confirmed': 'تایید',
  'deliveries.timeline.payment_confirmed': 'پرداخت تایید شد',
  'deliveries.timeline.delivered': 'تحویل',
  'deliveries.mark_as_delivered': '✓ تحویل شد',
  
  // Order Status
  'order.status.pending': 'در انتظار',
  'order.status.waiting_for_payment': 'در انتظار پرداخت',
  'order.status.food_delivering': 'در حال ارسال',
  'order.status.food_delivered': 'تحویل داده شد',
  'order.status.confirmed': 'تایید شده',

  // Service names
  'service.sharif_fastfood': 'شریف فست فود',
  'service.sharif_plus': 'شریف پلاس',
  'service.clean_food': 'کلین فود',
  'service.self': 'سلف',
  'service.dorm_cafeteria': 'سلف خوابگاه',
  'service.kelana': 'کلانا',
  'service.other': 'دیگر سرویس ها',

  // OtherMenu
  'other.title': 'دیگر سرویس ها',
  'other.coming_soon': 'به زودی!',
  'other.not_working': 'این صفحه هنوز کار نمی‌کند. ما به زودی این سرویس را ارائه خواهیم داد.',
  'other.stay_tuned': 'منتظر به‌روزرسانی‌ها باشید!',
  'other.close': 'بستن',

  // KelanaMenu
  'kelana.title': 'کلانا',
  'kelana.order_online_title': 'سفارش آنلاین کلانا',
  'kelana.order_online_text': 'شما می‌توانید از وب‌سایت کلانا سفارش خود را ثبت کنید. بعد از ثبت سفارش، کد سفارش و جزئیات آن را در صفحه ثبت سفارش وارد کنید.',
  'kelana.order_online_button': '🌐 سفارش آنلاین از کلانا',
  'kelana.after_order_text': 'بعد از ثبت سفارش در وب‌سایت کلانا، برای درخواست ارسال روی دکمه زیر کلیک کنید:',
  'kelana.submit_delivery': '📦 ثبت درخواست ارسال',
  'kelana.close': 'بستن',

  // CleanFoodMenu
  'cleanfood.title': 'کلین فود',
  'cleanfood.order_online_title': 'سفارش آنلاین کلین فود',
  'cleanfood.order_online_text': 'شما می‌توانید از وب‌سایت کلین فود سفارش خود را ثبت کنید. بعد از ثبت سفارش، کد سفارش و جزئیات آن را در صفحه ثبت سفارش وارد کنید.',
  'cleanfood.order_online_button': '🌐 سفارش آنلاین از کلین فود',
  'cleanfood.after_order_text': 'بعد از ثبت سفارش در وب‌سایت کلین فود، برای درخواست ارسال روی دکمه زیر کلیک کنید:',
  'cleanfood.submit_delivery': '📦 ثبت درخواست ارسال',
  'cleanfood.close': 'بستن',

  // Order Page - Kelana & Clean Food
  'order.kelana_title': 'ثبت سفارش کلانا',
  'order.cleanfood_title': 'ثبت سفارش کلین فود',
  'order.order_tracking_code': 'شماره سفارش / کد سفارش',
  'order.order_tracking_code_placeholder': 'کد سفارش خود را وارد کنید',
  'order.customer_name': 'نام شریف گیر',
  'order.customer_name_placeholder': 'نام شما',
  'order.delivery_address': 'آدرس تحویل',
  'order.select_delivery_address': 'آدرس تحویل را انتخاب کنید',
  'order.phone_number': 'شماره تماس',
  'order.phone_placeholder': 'شماره تماس شما',
  'order.extra_notes': 'یادداشت اضافی',
  'order.extra_notes_placeholder': 'توضیحات اضافی (اختیاری)',
  'order.checkout_summary': 'خلاصه پرداخت',
  'order.delivery_fee': 'هزینه ارسال',
  'order.total_price': 'جمع کل',
  'order.submit_order': 'ثبت سفارش',
  'order.submitting': 'در حال ارسال...',
  'order.loading': 'در حال بارگذاری...',
  'order.login_required': 'لطفاً برای ثبت سفارش وارد شوید.',
  'order.success_message': 'سفارش شما با موفقیت ثبت شد!',

  // Active Deliveries Section
  'delivery.active_deliveries_title': 'تحویل‌های فعال من',
  'delivery.origin': 'مبدا:',
  'delivery.destination': 'مقصد:',
  'delivery.amount': 'مبلغ:',
  'delivery.food_price': 'قیمت غذا:',
  'delivery.profit': 'سود (هزینه ارسال):',
  'delivery.status_waiting_payment': '💰 در انتظار پرداخت',
  'delivery.status_in_delivery': '✓ در حال ارسال',
  'delivery.confirm_payment': 'تایید پرداخت',
  'delivery.payment_confirmed': 'پرداخت با موفقیت تایید شد!',
  'delivery.payment_confirm_failed': 'تایید پرداخت ناموفق بود. لطفا دوباره تلاش کنید.',
  'delivery.phone': 'تلفن:',
  'delivery.order_code': 'کد سفارش:',
  'delivery.note': 'یادداشت:',
  'delivery.view_details_and_deliver': 'مشاهده جزئیات و تحویل',
  'delivery.reminder_title': 'یادآوری:',
  'delivery.reminder_text': 'پس از تحویل سفارش، از صفحه "تحویل‌های من" وضعیت را به تحویل شده تغییر دهید.',
  'delivery.toman': 'تومان',
  'delivery.order_code_will_be_shown_after_acceptance': 'کد سفارش بعد از پذیرش نمایش داده می‌شود',
  'delivery.refresh': 'بروزرسانی',
  'delivery.refreshing': 'در حال بروزرسانی...',
  'delivery.customer_phone': 'تلفن شریف گیر:',
  'delivery.delivery_person_phone': 'تلفن شریف بر:',
  'delivery.phone_required': 'لطفاً شماره تلفن خود را در تنظیمات حساب کاربری وارد کنید.',
  
  // Notifications
  'notification.success': 'موفق',
  'notification.error': 'خطا',
  'notification.info': 'اطلاعات',
  'notification.warning': 'هشدار',
  'notification.close': 'بستن',
  
  // Card Number
  'verify.card_number': 'شماره کارت',
  'verify.card_number_placeholder': 'شماره کارت خود را وارد کنید',
  'customer.delivery_person_card': 'شماره کارت شریف بر:',
  'customer.confirm_delivery': 'تایید تحویل',
  'customer.delivery_confirmed': 'تحویل با موفقیت تایید شد!',
  'customer.delivery_confirm_failed': 'تایید تحویل ناموفق بود. لطفا دوباره تلاش کنید.',
  
  // Policy
  'order.accept_policy': 'قوانین و مقررات را می‌پذیرم',
  'order.policy_link_text': 'مشاهده قوانین و مقررات',
  'order.policy_required': 'لطفاً قوانین و مقررات را بپذیرید',
  'policy.title': 'قوانین و مقررات',
  'policy.content_fa': `قوانین و مقررات استفاده از سرویس شریف‌رو

1. شرایط استفاده
- استفاده از این سرویس فقط برای دانشجویان و اعضای دانشگاه مجاز است.
- کاربر باید اطلاعات صحیح و کامل را ارائه دهد.

2. سفارش‌ها
- سفارش‌ها پس از ثبت نهایی می‌شوند و امکان لغو آن‌ها محدود است.
- هزینه سفارش قبل از ثبت باید پرداخت شود.

3. تحویل
- زمان تحویل تقریبی است و ممکن است تغییر کند.
- در صورت تأخیر در تحویل، با شریف گیر تماس گرفته خواهد شد.

4. پرداخت
- پرداخت به صورت نقدی انجام می‌شود.
- هزینه اضافی برای تحویل به برخی مکان‌ها ممکن است اعمال شود.

5. مسئولیت‌ها
- کاربر مسئول صحت اطلاعات ارائه شده است.
- در صورت بروز مشکل، با پشتیبانی تماس بگیرید.

6. حریم خصوصی
- اطلاعات کاربران محرمانه است و محافظت می‌شود.
- از اطلاعات فقط برای اهداف سرویس استفاده می‌شود.`,
  'policy.close': 'بستن',
  
  // Chat
  'chat.title': 'چت سفارش',
  'chat.placeholder': 'پیام خود را بنویسید...',
  'chat.send': 'ارسال',
  'chat.no_messages': 'هنوز پیامی ارسال نشده است',
  'chat.loading': 'در حال بارگذاری...',
  'chat.loading_error': 'خطا در بارگذاری پیام‌ها',
  'chat.send_error': 'خطا در ارسال پیام',
  'chat.auth_required': 'لطفاً برای استفاده از چت وارد شوید',
  'chat.customer_label': 'شریف گیر',
  'chat.delivery_label': 'شریف بر',
  
  // Exchange (Sharif Exchange)
  'exchange.title': 'شریف داد و ستد',
  'exchange.buy': 'خرید کد',
  'exchange.sell': 'فروش کد',
  'exchange.create_listing': 'ایجاد آگهی',
  'exchange.item_type': 'نوع آیتم',
  'exchange.item_name': 'نام غذا',
  'exchange.description': 'توضیحات',
  'exchange.price': 'قیمت (تومان)',
  'exchange.card_number': 'شماره کارت',
  'exchange.code_value': 'کد',
  'exchange.max_price': 'حداکثر قیمت: ۶۰,۰۰۰ تومان',
  'exchange.submit_listing': 'ثبت آگهی',
  'exchange.cancel': 'لغو',
  'exchange.buy_code': 'خرید',
  'exchange.i_paid': 'واریز کردم',
  'exchange.confirm_payment': 'تأیید واریز',
  'exchange.report': 'گزارش',
  'exchange.report_reason': 'دلیل گزارش',
  'exchange.submit_report': 'ثبت گزارش',
  'exchange.seller_card': 'شماره کارت فروشنده',
  'exchange.your_code': 'کد شما',
  'exchange.code_revealed': 'کد پس از تأیید پرداخت نمایش داده می‌شود',
  'exchange.status.active': 'فعال',
  'exchange.status.sold': 'فروخته شده',
  'exchange.status.cancelled': 'لغو شده',
  'exchange.status.flagged': 'گزارش شده',
  'exchange.status.expired': 'منقضی شده',
  'exchange.status.pending_payment': 'در انتظار پرداخت',
  'exchange.no_listings': 'هیچ آگهی فعالی وجود ندارد',
  'exchange.loading': 'در حال بارگذاری...',
  'exchange.create_success': 'آگهی با موفقیت ایجاد شد',
  'exchange.create_error': 'خطا در ایجاد آگهی',
  'exchange.price_error': 'قیمت نمی‌تواند بیش از ۶۰,۰۰۰ تومان باشد',
  'exchange.required_fields': 'لطفاً تمام فیلدها را پر کنید',
}

const en: Dict = {
  'common.english': 'English',
  'common.persian': 'فارسی',
  'common.home': 'Home',
  'common.account': 'Account',
  'common.cart': 'Cart',
  'common.orders_list': 'Orders List',

  'auth.welcome': 'Welcome to SharifRo',
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.redirect': 'Please login to access that page',
  'auth.password_min': 'Password must be at least 8 characters',
  'auth.name_required': 'Name is required',
  'auth.name': 'Full Name',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.phone': 'Phone Number',
  'auth.student_code': 'Student Code',
  'auth.placeholder.name': 'Your Full Name',
  'auth.placeholder.email': 'email@example.com',
  'auth.placeholder.password': 'Password',
  'auth.placeholder.phone': 'Phone Number',
  'auth.placeholder.student_code': 'Student Code',
  'auth.processing': 'Processing...',
  'auth.signin': 'Sign in',
  'auth.signup': 'Sign up',
  'auth.forgot': 'Forgot Password?',
  'auth.forgot_soon': 'Password recovery feature coming soon!',
  'auth.have_no_account': "Don't have an account yet? ",
  'auth.have_account': 'Already have an account? ',
  'auth.register_free': 'Register for free',
  'auth.signin_link': 'Sign in',

  'account.title': 'Account',
  'account.updated': 'Profile updated successfully',
  'account.update_failed': 'Failed to update profile',
  'account.name': 'Full Name',
  'account.email': 'Email',
  'account.studentCode': 'University Student Code',
  'account.credit': 'Credit',
  'account.phone': 'Phone Number',
  'account.not_set': 'Not set',
  'account.save': 'Save',
  'account.edit': 'Edit',
  'account.locked': 'Locked',
  'account.add_credit': 'Add Credit',
  'account.logout': 'Logout',
  'account.change_role': 'Change Role',
  'account.loading': 'Loading...'
  ,
  'home.checking_auth': 'Checking authentication...'
  ,
  'customer.filters': 'Filters',
  'customer.location': 'Location',
  'customer.order_now': 'Order Now',
  'customer.loading': 'Loading...',
  'customer.redirecting_login': 'Redirecting to login...',
  'customer.delivery_person_phone': 'Delivery Person Phone:',
  'customer.amount': 'Amount:',
  'customer.delivery_location': 'Delivery Location:',
  'customer.order_code': 'Order Code:'
  ,
  'order.success_submit': 'Your order has been placed successfully!'
  ,
  'cart.title': 'Shopping Cart',
  'cart.empty_title': 'Shopping Cart',
  'cart.empty_text': 'Your shopping cart is empty.',
  'cart.past_orders_title': 'My Past Orders',
  'cart.loading_orders': 'Loading orders...',
  'cart.no_past_orders': 'You have no past orders.'
  ,
  'errors.invalid_cart_data': 'Invalid cart data.',
  'errors.fetch_past_orders': 'Failed to fetch past orders.'
  ,
  'delivery.loading': 'Loading...',
  'delivery.login_required': 'Please log in to access delivery dashboard.',
  'delivery.dashboard': 'Delivery Dashboard',
  'delivery.accept_order': 'Accept Order',
  'delivery.order_confirmed': 'Order confirmed! Check "My Deliveries" to view details.',
  'delivery.accept_failed': 'Failed to accept order. Please try again.'
  ,
  'delivery.no_pending': 'No pending orders available.',
  'delivery.loading_orders': 'Loading orders...',
  'delivery.select_location': 'Select location',
  'delivery.clear_filter': 'Clear filter',
  'delivery.cost_min': 'Min',
  'delivery.cost_max': 'Max',
  'delivery.verification_required_title': '⚠️ Verification Required',
  'delivery.verification_required_text': 'Your account is not yet verified to accept delivery orders. Please complete the verification process to start delivering.',
  'delivery.go_to_verification': 'Go to Verification',
  'delivery.why_verification': 'Why Verification?',
  'delivery.why_1': '✓ Ensures safe and reliable deliveries',
  'delivery.why_2': '✓ Protects customers and delivery partners',
  'delivery.why_3': '✓ Verifies student identity',
  'delivery.why_4': '✓ Manual review by admins for security',
  'verify.title': '🎓 Delivery Partner Verification',
  'verify.subtitle': 'Submit your documents for manual review by our admin team',
  'verify.info_title': '⚠️ Important Information',
  'verify.info_text': 'Your verification will be manually reviewed by admins. This process may take 24-48 hours. You will receive a notification once your account is approved.',
  'verify.student_card': 'Student Card Photo',
  'verify.selfie': 'Self-Portrait (Selfie)',
  'verify.click_to_upload_student_card': 'Click to upload student card',
  'verify.click_to_upload_selfie': 'Click to upload your selfie',
  'verify.click_to_change': 'Click to change',
  'verify.hint': 'JPG, PNG or HEIC (max 10MB)',
  'verify.submit': 'Submit for Verification',
  'verify.submitting': 'Submitting...',
  'verify.please_login': 'Please log in to access verification.',
  'verify.need_both': 'Please upload both images.',
  'verify.must_login': 'You must be logged in to submit verification.',
  'verify.uploading': 'Uploading documents...',
  'verify.student_uploaded': 'Student card uploaded, uploading selfie...',
  'verify.creating_request': 'Creating verification request...',
  'verify.success': '✓ Verification request submitted successfully!',
  'verify.fail_prefix': 'Failed to submit verification: ',
  'verify.status.pending': 'Verification Pending',
  'verify.status.approved': 'Verification Approved',
  'verify.status.pending_msg': 'Your verification request is currently being reviewed by our admin team. This process typically takes 24-48 hours. You will be notified once your account is approved.',
  'verify.status.approved_msg': 'Your account has been verified! You can now accept delivery orders.',
  'verify.back_to_dashboard': 'Back to Dashboard',
  'role.loading_user': 'Loading user information...'
  ,
  'role.redirecting_login': 'Redirecting to login...'
  ,
  'role.customer': 'SharifGir'
  ,
  'role.delivery': 'SharifBar'
  ,
  'deliveries.loading': 'Loading...',
  'deliveries.login_required': 'Please log in to view your deliveries.',
  'deliveries.title': 'My Deliveries',
  'deliveries.refresh': 'Refresh',
  'deliveries.tab.all': 'All',
  'deliveries.tab.waiting_payment': 'Waiting Payment',
  'deliveries.tab.delivering': 'Delivering',
  'deliveries.tab.completed': 'Completed',
  'deliveries.none_title': 'No deliveries yet',
  'deliveries.none_text': 'Start accepting orders to see them here!',
  'deliveries.error_load': 'Failed to load deliveries',
  'deliveries.mark_delivered_success': 'Order marked as delivered!',
  'deliveries.mark_delivered_failed': 'Failed to mark order as delivered. Please try again.',
  'deliveries.customer_info': 'Customer Information',
  'deliveries.name': 'Full Name',
  'deliveries.phone': 'Phone',
  'deliveries.email': 'Email',
  'deliveries.pickup_from': 'Pick Up From',
  'deliveries.deliver_to': 'Deliver To',
  'deliveries.order_code': 'Order Code',
  'deliveries.not_available': 'Not available',
  'deliveries.price': 'Price',
  'deliveries.notes': 'Delivery Notes',
  'deliveries.timeline': 'Timeline',
  'deliveries.timeline.placed': 'Order placed',
  'deliveries.timeline.confirmed': 'Confirmed',
  'deliveries.timeline.payment_confirmed': 'Payment Confirmed',
  'deliveries.timeline.delivered': 'Delivered',
  'deliveries.mark_as_delivered': '✓ Mark as Delivered',
  
  // Order Status
  'order.status.pending': 'Pending',
  'order.status.waiting_for_payment': 'Waiting Payment',
  'order.status.food_delivering': 'In Delivery',
  'order.status.food_delivered': 'Delivered',
  'order.status.confirmed': 'Confirmed',

  // Service names
  'service.sharif_fastfood': 'Sharif Fast Food',
  'service.sharif_plus': 'Sharif Plus',
  'service.clean_food': 'Clean Food',
  'service.self': 'Self',
  'service.dorm_cafeteria': 'Dorm Cafeteria',
  'service.kelana': 'Kelana',
  'service.other': 'Other Services',

  // OtherMenu
  'other.title': 'Other Services',
  'other.coming_soon': 'Coming Soon!',
  'other.not_working': 'This page is not working yet. We\'re working hard to bring you this service soon.',
  'other.stay_tuned': 'Stay tuned for updates!',
  'other.close': 'Close',

  // KelanaMenu
  'kelana.title': 'Kelana',
  'kelana.order_online_title': 'Order Online from Kelana',
  'kelana.order_online_text': 'You can place your order from Kelana\'s website. After placing the order, enter the order code and details on the order submission page.',
  'kelana.order_online_button': '🌐 Order Online from Kelana',
  'kelana.after_order_text': 'After placing your order on Kelana\'s website, click the button below to submit a delivery request:',
  'kelana.submit_delivery': '📦 Submit Delivery Request',
  'kelana.close': 'Close',

  // CleanFoodMenu
  'cleanfood.title': 'Clean Food',
  'cleanfood.order_online_title': 'Order Online from Clean Food',
  'cleanfood.order_online_text': 'You can place your order from Clean Food\'s website. After placing the order, enter the order code and details on the order submission page.',
  'cleanfood.order_online_button': '🌐 Order Online from Clean Food',
  'cleanfood.after_order_text': 'After placing your order on Clean Food\'s website, click the button below to submit a delivery request:',
  'cleanfood.submit_delivery': '📦 Submit Delivery Request',
  'cleanfood.close': 'Close',

  // Order Page - Kelana & Clean Food
  'order.kelana_title': 'Place Kelana Order',
  'order.cleanfood_title': 'Place Clean Food Order',
  'order.order_tracking_code': 'Order Number / Order Code',
  'order.order_tracking_code_placeholder': 'Enter your order code',
  'order.customer_name': 'Customer Name',
  'order.customer_name_placeholder': 'Your Name',
  'order.delivery_address': 'Delivery Address',
  'order.select_delivery_address': 'Select delivery address',
  'order.phone_number': 'Phone Number',
  'order.phone_placeholder': 'Your phone number',
  'order.extra_notes': 'Extra Notes',
  'order.extra_notes_placeholder': 'Additional notes (optional)',
  'order.checkout_summary': 'Checkout Summary',
  'order.delivery_fee': 'Delivery Fee',
  'order.total_price': 'Total Price',
  'order.submit_order': 'Submit Order',
  'order.submitting': 'Submitting...',
  'order.loading': 'Loading...',
  'order.login_required': 'Please log in to place an order.',
  'order.success_message': 'Your order has been placed successfully!',

  // Active Deliveries Section
  'delivery.active_deliveries_title': 'My Active Deliveries',
  'delivery.origin': 'Origin:',
  'delivery.destination': 'Destination:',
  'delivery.amount': 'Amount:',
  'delivery.food_price': 'Food Price:',
  'delivery.profit': 'Profit (Delivery Fee):',
  'delivery.status_waiting_payment': '💰 Waiting Payment',
  'delivery.status_in_delivery': '✓ In Delivery',
  'delivery.confirm_payment': 'Confirm Payment',
  'delivery.payment_confirmed': 'Payment confirmed successfully!',
  'delivery.payment_confirm_failed': 'Failed to confirm payment. Please try again.',
  'delivery.phone': 'Phone:',
  'delivery.order_code': 'Order Code:',
  'delivery.note': 'Note:',
  'delivery.view_details_and_deliver': 'View Details & Deliver',
  'delivery.reminder_title': 'Reminder:',
  'delivery.reminder_text': 'After delivering the order, change the status to delivered from the "My Deliveries" page.',
  'delivery.toman': 'Toman',
  'delivery.order_code_will_be_shown_after_acceptance': 'Order code will be shown after acceptance',
  'delivery.refresh': 'Refresh',
  'delivery.refreshing': 'Refreshing...',
  'delivery.customer_phone': 'Customer Phone:',
  'delivery.delivery_person_phone': 'Delivery Person Phone:',
  'delivery.phone_required': 'Please enter your phone number in your account settings.',
  
  // Notifications
  'notification.success': 'Success',
  'notification.error': 'Error',
  'notification.info': 'Info',
  'notification.warning': 'Warning',
  'notification.close': 'Close',
  
  // Card Number
  'verify.card_number': 'Card Number',
  'verify.card_number_placeholder': 'Enter your card number',
  'customer.delivery_person_card': 'Delivery Person Card:',
  'customer.confirm_delivery': 'Confirm Delivery',
  'customer.delivery_confirmed': 'Delivery confirmed successfully!',
  'customer.delivery_confirm_failed': 'Failed to confirm delivery. Please try again.',
  
  // Policy
  'order.accept_policy': 'I accept the rules and policy',
  'order.policy_link_text': 'View rules and policy',
  'order.policy_required': 'Please accept the rules and policy to continue',
  'policy.title': 'Rules and Policy',
  'policy.content_en': `Rules and Policy for Using SharifRo Service

1. Terms of Use
- This service is only available for students and university members.
- Users must provide accurate and complete information.

2. Orders
- Orders are finalized after submission and cancellation is limited.
- Order payment must be completed before submission.

3. Delivery
- Delivery time is approximate and may vary.
- In case of delivery delay, customer will be contacted.

4. Payment
- Payment is made in cash.
- Additional fees may apply for delivery to certain locations.

5. Responsibilities
- Users are responsible for the accuracy of provided information.
- In case of issues, contact support.

6. Privacy
- User information is confidential and protected.
- Information is only used for service purposes.`,
  'policy.close': 'Close',
  
  // Chat
  'chat.title': 'Order Chat',
  'chat.placeholder': 'Type your message...',
  'chat.send': 'Send',
  'chat.no_messages': 'No messages yet',
  'chat.loading': 'Loading...',
  'chat.loading_error': 'Error loading messages',
  'chat.send_error': 'Error sending message',
  'chat.auth_required': 'Please log in to use chat',
  'chat.customer_label': 'SharifGir',
  'chat.delivery_label': 'SharifBar',
  
  // Exchange (Sharif Exchange)
  'exchange.title': 'Sharif Exchange',
  'exchange.buy': 'Buy Code',
  'exchange.sell': 'Sell Code',
  'exchange.create_listing': 'Create Listing',
  'exchange.item_type': 'Item Type',
  'exchange.item_name': ' Food Name',
  'exchange.description': 'Description',
  'exchange.price': 'Price (Toman)',
  'exchange.card_number': 'Card Number',
  'exchange.code_value': 'Code',
  'exchange.max_price': 'Max Price: 60,000 Toman',
  'exchange.submit_listing': 'Submit Listing',
  'exchange.cancel': 'Cancel',
  'exchange.buy_code': 'Buy',
  'exchange.i_paid': 'I Paid',
  'exchange.confirm_payment': 'Confirm Payment',
  'exchange.report': 'Report',
  'exchange.report_reason': 'Report Reason',
  'exchange.submit_report': 'Submit Report',
  'exchange.seller_card': 'Seller Card Number',
  'exchange.your_code': 'Your Code',
  'exchange.code_revealed': 'Code will be revealed after payment confirmation',
  'exchange.status.active': 'Active',
  'exchange.status.sold': 'Sold',
  'exchange.status.cancelled': 'Cancelled',
  'exchange.status.flagged': 'Flagged',
  'exchange.status.expired': 'Expired',
  'exchange.status.pending_payment': 'Pending Payment',
  'exchange.no_listings': 'No active listings',
  'exchange.loading': 'Loading...',
  'exchange.create_success': 'Listing created successfully',
  'exchange.create_error': 'Error creating listing',
  'exchange.price_error': 'Price cannot exceed 60,000 Toman',
  'exchange.required_fields': 'Please fill all required fields',
}

const dicts: Record<'fa' | 'en', Dict> = { fa, en }

export function useI18n() {
  const { locale } = useLanguage()
  const dict = dicts[locale]
  const t = useCallback((key: string) => dict[key] || key, [dict])
  return { t, locale }
}


