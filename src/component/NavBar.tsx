import { Component } from "solid-js"

const NavBar: Component = () => {
  const bgColor = "bg-[#1c2841]"
  return (
    <nav
      class={`${bgColor} flex-no-wrap relative flex min-h-16 w-full items-center shadow-md shadow-black/5 sm:h-24 lg:flex-wrap lg:justify-start lg:py-4`}
    >
      <div class="flex w-full flex-wrap items-center justify-between px-3">
        {/*<!-- Hamburger button for mobile view -->*/}
        <button
          class="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          data-te-collapse-init
          data-te-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {/*<!-- Hamburger icon */}
          <span class="[&>svg]:w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-7 w-7"
            >
              <path
                fill-rule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>

        {/*<!-- Collapsible navigation container */}
        <div
          class="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
          id="navbarSupportedContent1"
          data-te-collapse-item
        >
          {/*<!-- Logo */}
          <a
            class="mb-4 ml-2 mr-5 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
            href="#"
          >
            <img
              src="/images/logo.png"
              style={{ height: "40px" }}
              alt="Solluna Mushroom Farms Logo"
              loading="lazy"
            />
          </a>
          {/*<!-- Left navigation links */}
          <ul
            class="list-style-none mr-auto flex flex-col gap-5 pl-0 text-neutral-50 lg:flex-row"
            data-te-navbar-nav-ref
          >
            <li
              class="mb-4 lg:mb-0 lg:pr-2"
              data-te-nav-item-ref
            >
              {/*<!-- Dashboard link */}
              <a
                class="transition duration-200 hover:text-neutral-400 hover:ease-in-out "
                href="#"
                data-te-nav-link-ref
              >
                Home
              </a>
            </li>
            {/*<!-- Team link */}
            <li
              class="mb-4 lg:mb-0 lg:pr-2"
              data-te-nav-item-ref
            >
              <a
                class="transition duration-200 hover:text-neutral-400 hover:ease-in-out "
                href="#"
                data-te-nav-link-ref
              >
                Store
              </a>
            </li>
            {/*<!-- Projects link */}
            <li
              class="mb-4 lg:mb-0 lg:pr-2"
              data-te-nav-item-ref
            >
              <a
                class="transition duration-200 hover:text-neutral-400 hover:ease-in-out "
                href="#"
                data-te-nav-link-ref
              >
                About Us
              </a>
            </li>
          </ul>
        </div>

        <div class="flex">
          <label
            for="default-search"
            class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search
          </label>
          <div class="relative w-40 sm:w-[15rem] md:w-[20rem]">
            <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block h-12 w-full rounded-lg border border-gray-300 bg-white p-4 ps-10 text-sm text-gray-900"
              placeholder="Search..."
              required
            />
          </div>
        </div>

        {/*<!-- Right elements */}

        <div class="relative ml-5 flex items-center">
          {/*<!-- Container with two dropdown menus */}

          {/*<!-- Cart Icon */}
          <a
            class="mr-4 text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            href="#"
          >
            <span class="flex-no-shrink h-10 w-10 fill-neutral-50 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="flex-no-shrink h-5 w-5"
              >
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </span>
            <span class="absolute -mt-6 ml-3.5 rounded-full bg-error px-[0.4em] py-[0.22em] text-[0.7rem] font-bold leading-none text-white">
              4
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
