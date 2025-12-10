import PropTypes from 'prop-types';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-lg text-neutral-600">{message}</p>
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string
};
