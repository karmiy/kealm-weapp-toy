const useGlobalIconFont = () => {
  return {
    iconfont: `components/iconfont/${process.env.TARO_ENV}/${process.env.TARO_ENV}`,
  };
};

// es modules is unavaiable.
export { useGlobalIconFont };
