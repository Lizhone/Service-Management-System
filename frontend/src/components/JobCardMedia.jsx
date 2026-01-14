export default function JobCardMedia({ jobCardId }) {
  if (!jobCardId) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Job Card Media</h3>
      <p className="text-sm text-gray-500">
        Media support for Job Card #{jobCardId} will appear here.
      </p>
    </div>
  );
}
