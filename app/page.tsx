import { link } from "fs";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const links = [
  {
    liens: [
      {
        href: "/users",
        label: "Users"
      }
    ],
    description: "Gestion des utilisateurs"
  },
  {
    liens: [
      {
        href: "/products",
        label: "Products"
      },
      {
        href: "/categories",
        label: "Categories"
      }
    ],
    description: "Gestion des produits"
  },
  {
    liens: [
      {
        href: "/orders",
        label: "Orders"
      }
    ],
    description: "Gestion des commandes"
  },
  {
    liens: [
      {
        href: "/reports",
        label: "Reports"
      },
      {
        href: "/factures",
        label: "Factures"
      }
    ],
    description: "Gestion des rapports"
  }
];

export default function Home() {
  return (
    <header className="min-h-[calc(100vh-6rem)] rounded-lg m-4 shadow-xl flex items-start flex-wrap bg-linear-to-br from-gray-700 via-black to-gray-800 text-white p-8 pt-16">
      {links.map((link, index) => (
        <div key={index} className="p-4 m-4 bg-white rounded-md text-black basis-[300px] grow min-h-40">
          <h2 className="text-xl">{link.description}</h2>
          <hr className="border-black/25 mt-1" />
          {link.liens.map((lien, index) => (
            <>
              <Link
                key={index}
                href={lien.href}
                className="text-sm my-3 flex items-center gap-2 hover:gap-12 duration-300"
              >
                {lien.label}
                <IoIosArrowForward className="relative bottom-px" />
              </Link>
              {(index < link.liens.length - 1) &&
                <hr className="border-black/25" />              
              }
            </>
          ))}
        </div>
      ))}
    </header>
  );
}
