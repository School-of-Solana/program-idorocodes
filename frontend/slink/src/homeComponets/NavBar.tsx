"use client";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
const navigation = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#features" },
  { name: "Faq", href: "#faq" },
];
export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const closeMobileNav = () => {
      setMobileMenuOpen(false)
  }  
  return (
    <div className="p-5">
      {" "}
      <header className="fixed sm:w-full sm:mt7  w-full  m-auto mt-0   inset-x-0 top-0 font-inter backdrop-blur-3xl shadow bg-[#ffffffd7] text-black  z-50">
        {" "}
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-3 lg:px-8"
        >
          {" "}
          <div className="flex lg:flex-1">
            {" "}
            <a className="-m-1.5 p-1.5 text-green-900 text-3xl ">
              <span>s</span>
              <span className="text-black">l</span>
              <span>i</span>
              <span className="text-black">n</span>
              <span>k</span>
            </a>{" "}
          </div>{" "}
          <div className="flex lg:hidden">
            {" "}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
            >
              {" "}
              <span className="sr-only">Open main menu</span>{" "}
              <Bars3Icon aria-hidden="true" className="size-6" />{" "}
            </button>{" "}
          </div>{" "}
          <div className="hidden lg:flex lg:gap-x-12">
            {" "}
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm " >
                {" "}
                {item.name}{" "}
              </a>
            ))}{" "}
          </div>{" "}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {" "}
            <a href="/slink">
              <button className="text-sm/6 bg-green-500 text-white cursor-pointer w-30 p-2 rounded-3xl ">
                {" "}
                Send a Slink{" "}
              </button>
            </a>
           {" "}
          </div>{" "}
        </nav>{" "}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          {" "}
          <div className="fixed inset-0 z-50" />{" "}
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full transition-all text-center overflow-y-auto bg-green-50  p-6 sm:max-w-sm sm:ring-1 ">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <a className=" text-green-500 text-center  text-3xl ">
                <span>s</span>
                <span className="text-black ">l</span>
                <span>i</span>
                <span className="text-black">n</span>
                <span>k</span>
              </a>{" "}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md  "
              >
                {" "}
                <span className="sr-only">Close menu</span>{" "}
                <XMarkIcon aria-hidden="true" className="size-6" />{" "}
              </button>{" "}
            </div>{" "}
            <div className="mt-6 flow-root">
              {" "}
              <div className="-my-6 divide-y divide-white/10">
                {" "}
                <div className="space-y-2 py-6">
                  {" "}
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-white/5"
                      onClick={closeMobileNav}
                    >
                      {" "}
                      {item.name}{" "}
                    </a>
                  ))}{" "}
                  <button className="text-sm/6 bg-green-500 text-white cursor-pointer w-30 p-2 rounded-xl ">
                    {" "}
                    Send a Slink{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </DialogPanel>{" "}
        </Dialog>{" "}
      </header>{" "}
    </div>
  );
}
