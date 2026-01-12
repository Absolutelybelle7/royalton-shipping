export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing and using TrackXpress services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Services</h2>
            <p className="text-gray-600">
              TrackXpress provides logistics and shipping services including domestic shipping, international shipping, express delivery, and freight services. All shipments are subject to our shipping policies and applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">User Responsibilities</h2>
            <p className="text-gray-600 mb-2">As a user of our services, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not ship prohibited or restricted items</li>
              <li>Properly package items for shipment</li>
              <li>Pay all applicable fees and charges</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Prohibited Items</h2>
            <p className="text-gray-600">
              You may not ship hazardous materials, illegal substances, weapons, explosives, or any items prohibited by law. We reserve the right to refuse service for any shipment containing prohibited items.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Liability</h2>
            <p className="text-gray-600">
              Our liability for loss or damage to shipments is limited as specified in our shipping agreement. Additional insurance coverage is available for declared value shipments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Payment Terms</h2>
            <p className="text-gray-600">
              Payment is due at the time of service unless otherwise agreed. We accept major credit cards and electronic payments. Late payments may incur additional fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms and Conditions, please contact us at legal@trackxpress.com
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-6 border-t">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
