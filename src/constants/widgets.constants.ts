import accountsIcon from "../assets/images/widgets/accounts.png";
import adminsIcon from "../assets/images/widgets/admins.png";
import articlesIcon from "../assets/images/widgets/articles.png";
import branchesIcon from "../assets/images/widgets/branches.png";
import couponsIcon from "../assets/images/widgets/coupons.png";
import coursesIcon from "../assets/images/widgets/courses.png";
import galleryIcon from "../assets/images/widgets/gallery.png";
import newEnrollIcon from "../assets/images/widgets/new-enroll.png";
import newsIcon from "../assets/images/widgets/news.png";
import ordersIcon from "../assets/images/widgets/orders.png";
import paymentsIcon from "../assets/images/widgets/payments.png";
import productsIcon from "../assets/images/widgets/products.png";
import questionBankIcon from "../assets/images/widgets/question-bank.png";
import settingsIcon from "../assets/images/widgets/settings.png";
import slidersIcon from "../assets/images/widgets/sliders.png";
import studentsIcon from "../assets/images/widgets/students.png";
import { USER_ROLES } from "./userRoles.constants";

// widget items array
export const widgetItems = [
  {
    icon: accountsIcon,
    title: "Accounts",
    destination: "/accounts",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.acountant],
  },
  {
    icon: branchesIcon,
    title: "Branches",
    destination: "/branches",
    permission: [USER_ROLES.superAdmin],
  },
  {
    icon: coursesIcon,
    title: "Courses",
    destination: "/courses",
    permission: [
      USER_ROLES.superAdmin,
      USER_ROLES.admin,
      USER_ROLES.moderator,
      USER_ROLES.teacher,
    ],
  },
  {
    icon: newEnrollIcon,
    title: "New Enroll",
    destination: "/new-enroll",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: paymentsIcon,
    title: "Payments",
    destination: "/payments",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.acountant],
  },
  {
    icon: questionBankIcon,
    title: "Questions",
    destination: "/question-bank",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: couponsIcon,
    title: "Coupons",
    destination: "/coupons",
    permission: [USER_ROLES.superAdmin],
  },
  {
    icon: productsIcon,
    title: "Products",
    destination: "/products",
    permission: [USER_ROLES.superAdmin, USER_ROLES.moderator],
  },
  {
    icon: ordersIcon,
    title: "Orders",
    destination: "/orders",
    permission: [
      USER_ROLES.superAdmin,
      USER_ROLES.moderator,
      USER_ROLES.acountant,
    ],
  },
  {
    icon: articlesIcon,
    title: "Articles",
    destination: "/articles",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: newsIcon,
    title: "News",
    destination: "/news",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: slidersIcon,
    title: "Sliders",
    destination: "/sliders",
    permission: [USER_ROLES.superAdmin, USER_ROLES.moderator],
  },
  // {
  //     icon: headlinesIcon,
  //     title: "Headlines",
  //     destination: "/headlines",
  //     permission: [USER_ROLES.superAdmin, USER_ROLES.moderator],
  // },
  {
    icon: galleryIcon,
    title: "Gallery",
    destination: "/gallery",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: adminsIcon,
    title: "Admins",
    destination: "/admins",
    permission: [USER_ROLES.superAdmin],
  },
  {
    icon: studentsIcon,
    title: "Students",
    destination: "/students",
    permission: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator],
  },
  {
    icon: settingsIcon,
    title: "Settings",
    destination: "/settings",
    permission: [
      USER_ROLES.superAdmin,
      USER_ROLES.admin,
      USER_ROLES.moderator,
      USER_ROLES.teacher,
      USER_ROLES.acountant,
    ],
  },
];
