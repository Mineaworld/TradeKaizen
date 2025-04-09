// "use client";
// import { useTheme } from "next-themes";
// import { Moon, Sun } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// export function ThemeToggle() {
//   const [theme, setThemeState] = useState<string>("system");

//   // Function to update the theme in localStorage and apply it
//   const setTheme = (newTheme: string) => {
//     if (newTheme === "dark") {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setThemeState("dark");
//     } else if (newTheme === "light") {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setThemeState("light");
//     } else {
//       // System theme
//       localStorage.removeItem("theme");
//       setThemeState("system");
//       // Check system preference
//       if (
//         window.matchMedia &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches
//       ) {
//         document.documentElement.classList.add("dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//       }
//     }
//   };

//   // Initialize theme on component mount
//   useEffect(() => {
//     // Check localStorage first
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme === "dark") {
//       setTheme("dark");
//     } else if (savedTheme === "light") {
//       setTheme("light");
//     } else {
//       setTheme("system");
//     }

//     // Listen for system preference changes
//     if (window.matchMedia) {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//       const handleChange = () => {
//         if (localStorage.getItem("theme") === null) {
//           setTheme("system");
//         }
//       };

//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }
//   }, []);

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
