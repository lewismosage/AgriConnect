import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">About AgriConnect</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting communities with local farmers for fresher food, sustainable agriculture, and stronger local economies.
          </p>
        </div>

        {/* Our Mission Section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/images/farm-landscape.jpg" 
                  alt="Sustainable farming" 
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-farm.jpg';
                  }}
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At AgriConnect, we believe that food tastes better when you know where it comes from. Our platform connects consumers directly with local farmers, eliminating middlemen and creating a more sustainable and transparent food system.
              </p>
              <p className="text-gray-600 mb-4">
                We're committed to supporting sustainable farming practices, reducing food miles, and ensuring farmers receive fair compensation for their hard work and dedication.
              </p>
              <p className="text-gray-600">
                By choosing AgriConnect, you're not just buying groceries — you're investing in your community, supporting local agriculture, and contributing to a healthier planet.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20 bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">How AgriConnect Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">
                We partner with local farmers who share our commitment to quality, sustainability, and community. Each farm is vetted to ensure they meet our standards.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Shop</h3>
              <p className="text-gray-600">
                Browse our marketplace for fresh, seasonal produce, artisanal goods, and farm-raised meats. Know exactly where your food is coming from and how it was grown.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enjoy</h3>
              <p className="text-gray-600">
                Receive farm-fresh products delivered to your door or pick up from convenient locations. Experience the difference in taste and quality while supporting your local economy.
              </p>
            </div>
          </div>
        </div>

        {/* Our Impact Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-gray-600">Of profits go directly to farmers</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">70%</div>
              <p className="text-gray-600">Reduction in food transportation emissions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">150+</div>
              <p className="text-gray-600">Local farms supported across the region</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <p className="text-gray-600">Community members connecting with local agriculture</p>
            </div>
          </div>
        </div>

        {/* Meet Our Farmers Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet Some of Our Farmers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 overflow-hidden">
                <img 
                  src="/images/farmer-1.jpg" 
                  alt="Farmer Rebecca Johnson" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-farmer.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rebecca Johnson</h3>
                <p className="text-gray-500 mb-3">Sunrise Organic Farm</p>
                <p className="text-gray-600">
                  "AgriConnect has transformed my business. I now have a direct connection with people who appreciate our sustainable growing methods."
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 overflow-hidden">
                <img 
                  src="/images/farmer-2.jpg" 
                  alt="Farmer Miguel Sanchez" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-farmer.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Miguel Sanchez</h3>
                <p className="text-gray-500 mb-3">Green Valley Family Farm</p>
                <p className="text-gray-600">
                  "Being part of AgriConnect means I can focus on what I love – growing quality food – while knowing I have a reliable market for my products."
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 overflow-hidden">
                <img 
                  src="/images/farmer-3.jpg" 
                  alt="Farmer Sarah and David Lee" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-farmer.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah & David Lee</h3>
                <p className="text-gray-500 mb-3">Hillside Apiary</p>
                <p className="text-gray-600">
                  "This platform has allowed us to share our passion for beekeeping and sustainable honey production with a whole new community."
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/farms" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              Browse All Farms
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sustainability Practices Section */}
        <div className="mb-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Commitment to Sustainability</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Environmental Stewardship</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Supporting regenerative farming practices that build soil health</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Reducing food miles by keeping distribution local</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Encouraging biodiversity and pollinator-friendly farming</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Minimizing packaging waste with eco-friendly alternatives</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Creating fair market opportunities for small and medium-sized farms</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Supporting rural economies and preserving agricultural heritage</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Educating consumers about seasonal eating and food production</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Donating surplus food to local food banks and community programs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Join the Movement Section */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the AgriConnect Movement</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Be part of the solution for a more sustainable food system. Whether you're a consumer, farmer, or community partner, there's a place for you in our growing community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300">
              Shop Products
            </Link>
            <Link to="/farm-registration" className="px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-medium rounded-lg transition duration-300">
              Apply as a Farmer
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How do I know the food is truly local?</h3>
              <p className="text-gray-600">
                Every farm on our platform is located within 150 miles of our distribution centers. Each product listing shows exactly which farm produced it and where they're located. We regularly visit our partner farms to ensure they meet our standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Are all farms certified organic?</h3>
              <p className="text-gray-600">
                While many of our farms follow organic practices, not all have official certification due to the cost and administrative burden for small farms. We clearly label which farms are certified organic and which follow organic practices without certification. All farms in our network avoid synthetic pesticides and prioritize sustainable methods.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How does pricing work?</h3>
              <p className="text-gray-600">
                Farmers set their own prices based on their production costs. While our products might sometimes cost more than conventionally-grown supermarket alternatives, we ensure farmers receive fair compensation for their sustainable practices. We strive to keep our platform fees low so that farmers receive 85% of what you pay.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">What if I'm not satisfied with my purchase?</h3>
              <p className="text-gray-600">
                We stand behind the quality of our products. If you're not completely satisfied, contact our customer service team within 24 hours of receiving your order and we'll make it right with a replacement or refund.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-6">
                Have questions about AgriConnect? Want to learn more about our mission or how to get involved? We'd love to hear from you.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">support@agriconnect.com</span>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">+254 793 052198</span>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600">123 Harvest Lane</p>
                    <p className="text-gray-600">Farmville, CA 98765</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <a href="#" className="text-green-600 hover:text-green-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
                </div>
                
                <div>
                  <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-20 bg-green-600 rounded-2xl p-8 shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
            <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for seasonal recipes, farming tips, upcoming events, and exclusive offers from our partner farms.
            </p>
            
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 py-2 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button 
                type="submit" 
                className="bg-white text-green-600 font-medium py-2 px-6 rounded-r-md hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Our Team Section 
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/images/team-1.jpg" 
                  alt="Emily Chen, Founder & CEO" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-person.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Emily Chen</h3>
                <p className="text-green-600 mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  Former farmer with a passion for sustainable agriculture and food justice.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/images/team-2.jpg" 
                  alt="Marcus Rodriguez, CTO" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-person.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Marcus Rodriguez</h3>
                <p className="text-green-600 mb-3">CTO</p>
                <p className="text-gray-600">
                  Tech innovator focused on creating platforms that support rural communities.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/images/team-3.jpg" 
                  alt="Aisha Washington, Operations Director" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-person.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">Aisha Washington</h3>
                <p className="text-green-600 mb-3">Operations Director</p>
                <p className="text-gray-600">
                  Supply chain expert specializing in local food distribution systems.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md text-center">
              <div className="h-64 overflow-hidden">
                <img 
                  src="/images/team-4.jpg" 
                  alt="James Park, Community Relations" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-person.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">James Park</h3>
                <p className="text-green-600 mb-3">Community Relations</p>
                <p className="text-gray-600">
                  Former chef dedicated to connecting restaurants with local producers.
                </p>
              </div>
            </div>
          </div>
        </div>  */}

        {/* Partners & Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Partners & Certifications</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We're proud to work with organizations that share our commitment to sustainable food systems and community development.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <img 
                src="/images/partner-1.png" 
                alt="Organic Farmers Association" 
                className="h-16"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.jpg';
                }}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <img 
                src="/images/partner-2.png" 
                alt="Sustainable Agriculture Network" 
                className="h-16"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.jpg';
                }}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <img 
                src="/images/partner-3.png" 
                alt="Local Food Alliance" 
                className="h-16"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.jpg';
                }}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
              <img 
                src="/images/partner-4.png" 
                alt="Community Supported Agriculture Association" 
                className="h-16"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-logo.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience the Difference?</h2>
            <p className="text-white text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Join thousands of conscious consumers who are transforming how we grow, buy, and eat food in our communities.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition duration-300">
                Create an Account
              </Link>
              <Link to="/products" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-green-700 transition duration-300">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;