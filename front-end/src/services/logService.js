
function init() {
  // Raven.config("ADD YOUR OWN API KEY", {
  //   release: "1-0-0",
  //   environment: "development-test"
  // }).install();
}

function log(error) {
  console.error(error);
  // Raven.captureException(error);
}

const logger = {
  init,
  log
};
export default logger;
