import MainLayout from "../components/layouts/MainLayout";
import Accounts from "../pages/main/Accounts/Accounts";
import AccountsSummary from "../pages/main/AccountsSummary/AccountsSummary";
import AccountsYearSummary from "../pages/main/AccountsYearSummary/AccountsYearSummary";
import Admins from "../pages/main/Admins/Admins";
import AdminsCreate from "../pages/main/AdminsCreate/AdminsCreate";
import AdminsUpdate from "../pages/main/AdminsUpdate/AdminsUpdate";
import AdminsView from "../pages/main/AdminsView/AdminsView";
import AdminTrashes from "../pages/main/AdminTrashes/AdminTrashes";
import ArticleCategories from "../pages/main/ArticleCategories/ArticleCategories";
import ArticleCategoriesCreate from "../pages/main/ArticleCategoriesCreate/ArticleCategoriesCreate";
import ArticleCategoriesUpdate from "../pages/main/ArticleCategoriesUpdate/ArticleCategoriesUpdate";
import Articles from "../pages/main/Articles/Articles";
import ArticlesCreate from "../pages/main/ArticlesCreate/ArticlesCreate";
import ArticlesUpdate from "../pages/main/ArticlesUpdate/ArticlesUpdate";
import Branches from "../pages/main/Branches/Branches";
import BranchesCreate from "../pages/main/BranchesCreate/BranchesCreate";
import BranchesUpdate from "../pages/main/BranchesUpdate/BranchesUpdate";
import Coupons from "../pages/main/Coupons/Coupons";
import CouponsCreate from "../pages/main/CouponsCreate/CouponsCreate";
import CouponsUpdate from "../pages/main/CouponsUpdate/CouponsUpdate";
import CourseCategories from "../pages/main/CourseCategories/CourseCategories";
import CourseCategoriesCreate from "../pages/main/CourseCategoriesCreate/CourseCategoriesCreate";
import CourseCategoriesUpdate from "../pages/main/CourseCategoriesUpdate/CourseCategoriesUpdate";
import Courses from "../pages/main/Courses/Courses";
import CoursesCreate from "../pages/main/CoursesCreate/CoursesCreate";
import CoursesReviews from "../pages/main/CoursesReviews/CoursesReviews";
import CoursesUpdate from "../pages/main/CoursesUpdate/CoursesUpdate";
import CoursesView from "../pages/main/CoursesView/CoursesView";
import CQCreate from "../pages/main/CQCreate/CQCreate";
import CQQuestions from "../pages/main/CQQuestions/CQQuestions";
import CQUpdate from "../pages/main/CQUpdate/CQUpdate";
import DuePayments from "../pages/main/DuePayments/DuePayments";
import ExamsCreate from "../pages/main/ExamsCreate/ExamsCreate";
import ExamsQuestionsAdd from "../pages/main/ExamsQuestionsAdd/ExamsQuestionsAdd";
import ExamsQuestionsAddManually from "../pages/main/ExamsQuestionsAddManually/ExamsQuestionsAddManually";
import ExamsResult from "../pages/main/ExamsResult/ExamsResult";
import ExamsResultReview from "../pages/main/ExamsResultReview/ExamsResultReview";
import ExamsUpdate from "../pages/main/ExamsUpdate/ExamsUpdate";
import ExamsView from "../pages/main/ExamsView/ExamsView";
import Filter from "../pages/main/Filter/Filter";
import Gallery from "../pages/main/Gallery/Gallery";
import Headlines from "../pages/main/Headlines/Headlines";
import Home from "../pages/main/Home/Home";
import LecturesCreate from "../pages/main/LecturesCreate/LecturesCreate";
import LecturesUpdate from "../pages/main/LecturesUpdate/LecturesUpdate";
import LiveClassesCreate from "../pages/main/LiveClassesCreate/LiveClassesCreate";
import LiveClassesUpdate from "../pages/main/LiveClassesUpdate/LiveClassesUpdate";
import MCQCreate from "../pages/main/MCQCreate/MCQCreate";
import MCQQuestions from "../pages/main/MCQQuestions/MCQQuestions";
import MCQUpdate from "../pages/main/MCQUpdate/MCQUpdate";
import ModulesView from "../pages/main/ModulesView/ModulesView";
import NewEnroll from "../pages/main/NewEnroll/NewEnroll";
import News from "../pages/main/News/News";
import NewsCategories from "../pages/main/NewsCategories/NewsCategories";
import NewsCategoriesCreate from "../pages/main/NewsCategoriesCreate/NewsCategoriesCreate";
import NewsCategoriesUpdate from "../pages/main/NewsCategoriesUpdate/NewsCategoriesUpdate";
import NewsCreate from "../pages/main/NewsCreate/NewsCreate";
import NewsUpdate from "../pages/main/NewsUpdate/NewsUpdate";
import NotesCreate from "../pages/main/NotesCreate/NotesCreate";
import NotesUpdate from "../pages/main/NotesUpdate/NotesUpdate";
import Orders from "../pages/main/Orders/Orders";
import Payments from "../pages/main/Payments/Payments";
import PaymentsPrint from "../pages/main/PaymentsPrint/PaymentsPrint";
import PrintInvoice from "../pages/main/PrintInvoice/PrintInvoice";
import ProductCategories from "../pages/main/ProductCategories/ProductCategories";
import ProductCategoriesCreate from "../pages/main/ProductCategoriesCreate/ProductCategoriesCreate";
import ProductCategoriesUpdate from "../pages/main/ProductCategoriesUpdate/ProductCategoriesUpdate";
import Products from "../pages/main/Products/Products";
import ProductsCreate from "../pages/main/ProductsCreate/ProductsCreate";
import ProductsUpdate from "../pages/main/ProductsUpdate/ProductsUpdate";
import QuestionBank from "../pages/main/QuestionBank/QuestionBank";
import Settings from "../pages/main/Settings/Settings";
import Sliders from "../pages/main/Sliders/Sliders";
import Students from "../pages/main/Students/Students";
import StudentsUpdate from "../pages/main/StudentsUpdate/StudentsUpdate";
import StudentsView from "../pages/main/StudentsView/StudentsView";
import Tags from "../pages/main/Tags/Tags";

export const mainRoutes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "accounts",
                element: <Accounts />,
            },
            {
                path: "accounts/summary",
                element: <AccountsSummary />,
            },
            {
                path: "accounts/summary/:year",
                element: <AccountsYearSummary />,
            },
            {
                path: "admins",
                element: <Admins />,
            },
            {
                path: "create-admin",
                element: <AdminsCreate />,
            },
            {
                path: "admin-trashes",
                element: <AdminTrashes />,
            },
            {
                path: "update-admin/:adminID",
                element: <AdminsUpdate />,
            },
            {
                path: "admin/:adminID",
                element: <AdminsView />,
            },
            {
                path: "article-categories",
                element: <ArticleCategories />,
            },
            {
                path: "create-article-category",
                element: <ArticleCategoriesCreate />,
            },
            {
                path: "update-article-category/:articleCategoryID",
                element: <ArticleCategoriesUpdate />,
            },
            {
                path: "articles",
                element: <Articles />,
            },
            {
                path: "create-article",
                element: <ArticlesCreate />,
            },
            {
                path: "update-article/:articleID",
                element: <ArticlesUpdate />,
            },
            {
                path: "branches",
                element: <Branches />,
            },
            {
                path: "create-branch",
                element: <BranchesCreate />,
            },
            {
                path: "update-branch/:branchID",
                element: <BranchesUpdate />,
            },
            {
                path: "coupons",
                element: <Coupons />,
            },
            {
                path: "create-coupon",
                element: <CouponsCreate />,
            },
            {
                path: "update-coupon/:couponID",
                element: <CouponsUpdate />,
            },
            {
                path: "course-categories",
                element: <CourseCategories />,
            },
            {
                path: "create-course-category",
                element: <CourseCategoriesCreate />,
            },
            {
                path: "update-course-category/:courseCategoryID",
                element: <CourseCategoriesUpdate />,
            },
            {
                path: "courses",
                element: <Courses />,
            },
            {
                path: "create-course",
                element: <CoursesCreate />,
            },
            {
                path: "courses/:courseID/reviews",
                element: <CoursesReviews />,
            },
            {
                path: "update-course/:courseID",
                element: <CoursesUpdate />,
            },
            {
                path: "course/:courseID",
                element: <CoursesView />,
            },
            {
                path: "create-cq",
                element: <CQCreate />,
            },
            {
                path: "questions/CQ",
                element: <CQQuestions />,
            },
            {
                path: "update-cq/:cqID",
                element: <CQUpdate />,
            },
            {
                path: "due-payments",
                element: <DuePayments />,
            },
            {
                path: "module/:moduleID/create-exam",
                element: <ExamsCreate />,
            },
            {
                path: "exam/:examID/add-questions",
                element: <ExamsQuestionsAdd />,
            },
            {
                path: "exam/:examID/add-questions-manually",
                element: <ExamsQuestionsAddManually />,
            },
            {
                path: "result/:examID",
                element: <ExamsResult />,
            },
            {
                path: "result/:examID/student/:userID/review",
                element: <ExamsResultReview />,
            },
            {
                path: "module/:moduleID/update-exam/:examID",
                element: <ExamsUpdate />,
            },
            {
                path: "exam/:examID",
                element: <ExamsView />,
            },
            {
                path: "gallery",
                element: <Gallery />,
            },
            {
                path: "filters",
                element: <Filter />,
            },
            {
                path: "headlines",
                element: <Headlines />,
            },
            {
                path: "module/:moduleID/create-lecture",
                element: <LecturesCreate />,
            },
            {
                path: "module/:moduleID/update-lecture/:lectureID",
                element: <LecturesUpdate />,
            },
            {
                path: "module/:moduleID/create-live-class",
                element: <LiveClassesCreate />,
            },
            {
                path: "module/:moduleID/update-live-class/:liveClassID",
                element: <LiveClassesUpdate />,
            },
            {
                path: "create-mcq",
                element: <MCQCreate />,
            },
            {
                path: "questions/MCQ",
                element: <MCQQuestions />,
            },
            {
                path: "update-mcq/:mcqID",
                element: <MCQUpdate />,
            },
            {
                path: "module/:moduleID",
                element: <ModulesView />,
            },
            {
                path: "new-enroll",
                element: <NewEnroll />,
            },
            {
                path: "news",
                element: <News />,
            },
            {
                path: "create-news",
                element: <NewsCreate />,
            },
            {
                path: "update-news/:newsID",
                element: <NewsUpdate />,
            },
            {
                path: "news-categories",
                element: <NewsCategories />,
            },
            {
                path: "create-news-category",
                element: <NewsCategoriesCreate />,
            },
            {
                path: "update-news-category/:newsCategoryID",
                element: <NewsCategoriesUpdate />,
            },
            {
                path: "module/:moduleID/create-note",
                element: <NotesCreate />,
            },
            {
                path: "module/:moduleID/update-note/:noteID",
                element: <NotesUpdate />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "payments",
                element: <Payments />,
            },
            {
                path: "print-reciept/:purchaseID",
                element: <PaymentsPrint />,
            },
            {
                path: "print-invoice/:orderID",
                element: <PrintInvoice />,
            },
            {
                path: "product-categories",
                element: <ProductCategories />,
            },
            {
                path: "create-product-category",
                element: <ProductCategoriesCreate />,
            },
            {
                path: "update-product-category/:productCategoryID",
                element: <ProductCategoriesUpdate />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "create-product",
                element: <ProductsCreate />,
            },
            {
                path: "update-product/:productID",
                element: <ProductsUpdate />,
            },
            {
                path: "question-bank",
                element: <QuestionBank />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "sliders",
                element: <Sliders />,
            },
            {
                path: "students",
                element: <Students />,
            },
            {
                path: "update-student/:studentID",
                element: <StudentsUpdate />,
            },
            {
                path: "student/:studentID",
                element: <StudentsView />,
            },
            {
                path: "tags",
                element: <Tags />,
            },
        ],
    },
];
