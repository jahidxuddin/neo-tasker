import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import CalenderManagerPage from "./calender-manager";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "/",
				element: <CalenderManagerPage />,
			},
		],
	},
]);

export default router;
