const sdk = require("@defillama/sdk");
const { erc20 } = require("@defillama/sdk/build/api");

// timestamp, block, chain, { api }

async function tvl(block, chain) {
  // Silica Market
  let url = "https://internalthegraph.alkimiya.io/subgraphs/name/alkimiya";
  const silicas = (
    await (
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{
          silicaV21S {
            id
            paymentTokenAddress
            rewardTokenAddress
          }
          }`,
        }),
      })
    ).json()
  ).data.silicaV21S;

  const balanceCalls = [];
  for (const silica of silicas) {
    balanceCalls.push(
      {
        target: silica.paymentTokenAddress,
        params: silica.id,
      },
      {
        target: silica.rewardTokenAddress,
        params: silica.id,
      }
    );
  }

  // SILICA VAULT
  const silicaVaultAddress = "";
  const svPaymentToken = "";
  const svRewardToken = "";
  balanceCalls.push(
    {
      target: svPaymentToken,
      params: silicaVaultAddress,
    },
    {
      target: svRewardToken,
      params: silicaVaultAddress,
    }
  );

  console.log(balanceCalls);

  const tokenBalances = await sdk.api.abi.multiCall({
    abi: "erc20:balanceOf",
    calls: balanceCalls,
    // block,
    // chain,
  });

  sdk.util.sumMultiBalanceOf(balances, tokenBalances, true, chain);

  return balances;
}

tvl();

module.exports = {
  timetravel: true,
  misrepresentedTokens: false,
  methodology: "", // TODO
  start: 0, // TODO
  ethereum: {
    tvl,
  },
};
