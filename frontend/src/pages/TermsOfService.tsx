import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, User, farm, Clipboard, Copyright, ShoppingCart, AlertTriangle, ArrowLeft  } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms of Service | AgriConnect</title>
        <meta name="description" content="AgriConnect Terms of Service" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-lg text-emerald-600">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Leaf className="mr-2 h-6 w-6 text-emerald-500" />
              Welcome to AgriConnect
            </h2>
            <p className="text-gray-600 mb-4">
              These Terms of Service govern your access to and use of AgriConnect's website, mobile app, and services. By accessing or using our Platform, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="space-y-8">
            <Section 
              title="1. Account Registration" 
              icon={<User className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">To access certain features, you must register for an account. You agree to provide accurate information and keep it updated.</p>
                  <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                </>
              }
            />

            <Section 
              title="2. User Responsibilities" 
              icon={<Clipboard className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>You will use the Platform only for lawful purposes</li>
                    <li>You will not engage in any fraudulent activity</li>
                    <li>You will not interfere with the Platform's operation</li>
                    <li>Farmers agree to provide accurate product information</li>
                  </ul>
                </>
              }
            />

            <Section 
              title="3. Transactions" 
              icon={<ShoppingCart className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">AgriConnect facilitates transactions between farmers and consumers but is not a party to these transactions.</p>
                  <p>All sales are final unless otherwise specified by the farmer.</p>
                </>
              }
            />

            <Section 
              title="4. Intellectual Property" 
              icon={<Copyright className="h-5 w-5 text-emerald-500" />}
              content={
                <>
                  <p className="mb-3">All content on the Platform is owned by AgriConnect or its licensors.</p>
                  <p>Farmers retain ownership of their product listings and images.</p>
                </>
              }
            />

            <Section 
              title="5. Limitation of Liability" 
              icon={<AlertTriangle className="h-5 w-5 text-emerald-500" />}
              content={
                <p>AgriConnect shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
              }
            />

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@agriconnect.com" className="text-emerald-600 hover:underline">
                  legal@agriconnect.com
                </a>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, content }: { title: string; icon: React.ReactNode; content: React.ReactNode }) => (
  <div className="border-l-4 border-emerald-200 pl-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
      <span className="mr-2">{icon}</span>
      {title}
    </h3>
    <div className="text-gray-600">
      {content}
    </div>
  </div>
);

export default TermsOfService;