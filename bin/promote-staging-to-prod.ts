import fetch from "node-fetch";

type PromotionResult = {
  status: string;
  id: string;
};

const promoteToProd = async (maxTry = 1, tryNumber = 1): Promise<unknown> => {
  const body = {
    pipeline: { id: "772cf875-88ef-4f44-a89e-f888f45cbddc" },
    source: { app: { id: "0b6e77e8-ed30-4a5a-9cc7-3791b3fd2206" } },
    targets: [{ app: { id: "a179804c-882c-4e2c-b5df-e202bdc8cb3d" } }],
  };

  const response = await fetch("https://api.heroku.com/pipeline-promotions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: `Bearer ${process.env.HEROKU_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const responseBody = (await response.json()) as PromotionResult;

  if (response.status === 401) {
    throw new Error("💥 Unauthorized");
  }

  return checkStatus(responseBody.id, maxTry, tryNumber);
};

const checkStatus = async (
  id: string,
  maxTry: number,
  tryNumber: number,
): Promise<unknown> => {
  const response = await fetch(
    `https://api.heroku.com/pipeline-promotions/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.heroku+json; version=3",
        Authorization: `Bearer ${process.env.HEROKU_TOKEN}`,
      },
    },
  );

  const body = (await response.json()) as PromotionResult;

  if (response.status === 200) {
    if (body.status === "pending" && tryNumber > maxTry) {
      throw new Error(
        `💥 The staging app hasn't been promoted after ${maxTry}.\nPlease investigate.`,
      );
    } else if (body.status === "pending" && tryNumber <= maxTry) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            "🤖",
            `Status still 'pending', retry ${tryNumber}/${maxTry}`,
          );
          resolve(checkStatus(id, maxTry, tryNumber + 1));
        }, 500);
      });
    } else if (body.status === "completed") {
      return new Promise((resolve) => resolve("✅ Sucessful promotion"));
    }
  } else if (response.status === 401) {
    throw new Error("💥 Unauthorized");
  } else if (response.status === 404) {
    throw new Error("💥 Targeted promotion-status doesn't exist");
  }
  return;
};

export { promoteToProd };
