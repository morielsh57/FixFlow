export let homePageApiCalledWithTimeStamp = -1;

export const setHomePageApiCalledWithTimeStamp = (timestamp: number) => {
  homePageApiCalledWithTimeStamp = timestamp;
};

export const getHomePageApiCalledWithTimeStamp = (): number => {
  return homePageApiCalledWithTimeStamp;
};
