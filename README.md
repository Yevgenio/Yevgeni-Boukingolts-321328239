# WEB Project Part 2
Yevgeni Boukingolts 321328239

1.	חשוב לציין, עמוד הבית נגיש דרך קובץ layout.html שמשמש כעמוד בסיס עבור שאר האתר. האתר משתמש בשתי שיטות של הצגת עמודים. דרך אחת היא מעבר לעמוד על ידי טעינת קובץ html שלם. השיטה השנייה היא טעינה של קטעי קוד של אלמנטים מתוך קבצי html נפרדים וקינון שלהם בתוך אלמנטים שכבר טעונים על העמוד. עמוד הבית למשל מחולק ל-5 אלמנטים ראשיים ומוקדשים למטרות הבאות: חיבור וניהול משתמש, חיפוש, תצוגת צד ושתי תצוגות ראשיות. 
2.	האתר משתמש בקובץ css יחיד שניגש לאלמנטים דרך שמות ה-class שלהם. למרבית הכפתורים ישנה תגובה ויזואלית כלשהי כשנמצאים מעליהם עם העכבר כדי לשדר את זה שהם לחיצים. האתר משתמש במספר אנימציות, לרוב האנימציות המופעלות על ידי css הן אנימצות קטנות כמו שינוי גודל או עלייה הדרגתית של הנראות. 
3.	אנימציות יותר מסובכות מופעלות על ידי קוד js למשל בזמן המעבר בין עמוד החיבור ועמוד ההרשמה (וגם בזמן הכניסה לאחד מהם) קיימת אנימציה שמעלימה ומוסיפה שורות לעמוד. אנימציה נוספת מרימה ומורידה את שורת החיפוש על מנת לפנות את המקום עבור הצגת תוצאות חיפוש. 
4.	תוצאות החיפוש נשלפות מתוך קובץ json של פעילויות ואירועים כאשר הנתונים של כל אובייקט שנמצא מוזנים לתוך תבנית של אלמנט html ומוצגים על העמוד למשתמש. לכל אירוע יש נקודת ציון וישנו חישוב המרחק בין מיקום האירוע והמיקום הנוכחי של המשתמש. כאשר המשתמש נרשם נוצר אובייקט שבשלב מאוחר יותר יוזן לתוך בסיס הנתונים של האתר.
