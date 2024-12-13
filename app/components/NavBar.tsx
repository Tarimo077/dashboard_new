import Image from 'next/image';

const NavBar = () => {
  return (
    <>
      <div className="drawer mx-0 my-0 px-0 z-10">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-100 w-full">
            <div className="flex-none">
              {/* Hamburger button for all screen sizes */}
              <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-5 mx-0 my-0 px-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <Image src="/media/pplogo.png" alt="PowerPay Logo" width={220} height={200} />
            </div>
  <label className="flex cursor-pointer gap-2  bg-base-100">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
  <input type="checkbox" value="autumn" className="toggle theme-controller" />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path
      d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
</label> 
          </div>
          <div className="divider divider-success pt-0 mt-0 h-2 m-2"></div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-100 min-h-full w-72 p-2 ">
          <Image src="/media/pplogo.png" alt="PowerPay Logo" width={250} height={250} className='mb-6 align-middle' />
          <li className="p-2">
            <a className="text-2xl ml-2 text-green-600 font-semibold hover:ml-6 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">
                <i className="bi bi-house-fill mr-2 p-0 text-center"></i>Home
            </a>
          </li>
          <li className="p-2">
            <a className="text-2xl ml-2 text-green-600 font-semibold hover:ml-6 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">
                <i className="bi bi-cpu-fill mr-2 p-0"></i>Devices
            </a>
          </li>
          <li className="p-2">
            <a className="text-2xl ml-2 text-green-600 font-semibold hover:ml-6 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">
                <i className="bi bi-people-fill mr-2 p-0 text-center"></i>Customers
            </a>
          </li>
          <details open className="p-2">
            <summary className="text-2xl ml-0 text-green-600 font-semibold"><i className="bi bi-cart-fill mr-4 p-0 text-center"></i>Sales</summary>
            <ul>
              <li><a className="text-lg ml-14 text-green-600 font-semibold hover:ml-20 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">All Sales</a></li>
              <details open className="p-2">
                <summary className="text-lg ml-12 text-green-600 font-semibold">Paygo Sales</summary>
                <ul>
                    <li><a className="text-lg ml-14 text-green-600 font-semibold hover:ml-20 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">Metered</a></li>
                    <li><a className="text-lg ml-14 text-green-600 font-semibold hover:ml-20 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">Non-Metered</a></li>
                </ul>
              </details>
            </ul>
          </details>
          <li className="p-2">
            <a className="text-2xl ml-2 text-green-600 font-semibold hover:ml-6 hover:bg-green-600 hover:text-base-100 hover:transition-all duration-75 ease-in-out flex items-center">
                <i className="bi bi-arrow-left-right mr-2 p-0 text-center"></i>Transactions
            </a>
          </li>
          </ul>
          <div className="absolute bottom-0 ">
          <label className="text-center text-green-600 text-sm ml-1 italic"><i className="bi bi-c-circle-fill mr-1"></i>Powerpay Africa. All Rights Reserved.</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
