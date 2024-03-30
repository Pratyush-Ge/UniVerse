/* eslint-disable react/prop-types */
const FeedCard = ({ title, content, image, author, createdAt, time }) => {
  const timeAgo = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const diffTime = Math.abs(now - createdAtDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="border rounded-lg shadow bg-white dark:border-gray-700 h-auto flex flex-col">
        {image && (
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <img
              className="absolute object-cover w-full h-full rounded-t-lg"
              src={`../backend/uploads/${image}`}
              alt="Post Image"
            />
          </div>
        )}
        <div className="flex-grow p-4">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-800">{content}</p>
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-400">
              {`Posted by ${author}`}
            </p>
            <p className="text-xs text-gray-400">
              {timeAgo(createdAt)}
            </p>
            <p className="text-xs text-gray-400">
              {time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
