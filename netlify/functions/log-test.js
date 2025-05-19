exports.handler = async () => {
  console.error('LogTest: Testing logging at', new Date().toISOString());
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Log test' }),
  };
};
