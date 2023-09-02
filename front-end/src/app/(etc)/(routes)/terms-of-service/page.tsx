import "../../../globals.css";

import React from "react";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-white bg-white bg-opacity-20 p-8 rounded-lg shadow-lg backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Terms of Service for MyAlias
          </h1>
          <p className="text-sm text-gray-300 mb-4">
            Last Updated: September 1, 2023.
          </p>

          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>

          <p>
            Welcome to MyAlias, a service provided by MyAlias.pro. These Terms
            of Service (&quot;Terms&quot;) govern your access to and use of the MyAlias
            email alias provider and any related services.
          </p>

          <p className="mt-4">
            By using MyAlias, you agree to comply with and be bound by these
            Terms. If you do not agree to these Terms, please do not use the
            Service.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            2. Description of Service
          </h2>

          <p>
            MyAlias is an email alias provider that instantly forwards emails to
            your primary email address without storing them on our servers.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            3. Free and Paid Plans
          </h2>

          <p>
            MyAlias offers both free and paid plans. The features and
            limitations of each plan are outlined on our website. We reserve the
            right to change the pricing or features of our plans at any time.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            4. No Storage of Emails
          </h2>

          <p>
            MyAlias instantly forwards emails and does not store them on our
            servers. Users are advised to ensure they have adequate storage and
            security measures in place for their primary email account.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">5. User Conduct</h2>

          <p>
            Users agree not to use the service for any unlawful purposes or in
            any way that could damage, disable, overburden, or impair the
            service.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            6. Limitation of Liability
          </h2>

          <p>
            To the fullest extent permitted by applicable law, MyAlias will not
            be liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            7. Changes to the Terms
          </h2>

          <p>
            We may revise these Terms from time to time. The most current
            version will always be on our website. By continuing to access or
            use the Service after revisions become effective, you agree to be
            bound by the revised Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">8. Termination</h2>

          <p>
            MyAlias reserves the right to terminate or suspend any user account
            and access to the Service for any reason, including violations of
            these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            9. Governing Law & Jurisdiction
          </h2>

          <p>
            These Terms are governed by and construed in accordance with the
            laws of European Union, without regard to its conflict of law rules.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">
            10. Contact Information
          </h2>

          <p>
            For any questions about these Terms, please contact us at [current
            support email].
          </p>

          {/* Footer */}
          <footer className="mt-20">
            <p className="text-center text-gray-300">
              © 2023 myalias.pro All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
