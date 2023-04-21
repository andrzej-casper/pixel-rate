import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { readFile } from "fs/promises";
import { useState } from "react";
import invariant from "tiny-invariant";
import { MoviePageView } from "~/components/moviepage";
import { getMovie } from "~/models/movie.server";
import { loaderMovieWasm } from "~/models/movie-wasm.server";
import { useOptionalUser } from "~/utils";
import useApp from "~/context";
import { toast } from "react-toastify";
import { sendDeploy } from "~/blockchain";

export const loader = loaderMovieWasm;

export default function MovieDetailsPage() {
  const { movie, ratingWasmStr } = useLoaderData<typeof loader>();
  const ratingWasm = new Uint8Array(atob(ratingWasmStr).split("").map(
      (char)=>char.charCodeAt(0)
    )
  );
  const user = useOptionalUser();
  const { activeWalletKey } = useApp();
  const navigate = useNavigate();

  const [starsHovered, setStarsHovered] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  const placeRating = async (slug: string, rate: number) => {
    console.log("Rated", slug, "with", rate);

    if (!user && !activeWalletKey) {
      toast.warning("You must be logged first.");
      navigate("/login");
      return;
    }

    if (!activeWalletKey) {
      toast.error("Rating is not supported for non-blockchain accounts yet.")
      return;
    }

    const depHash = await sendDeploy(activeWalletKey, ratingWasm, slug, rate);
    toast.success("Rating submitted to blockchain!");
    setTimeout(() => {
      window.open("https://testnet.cspr.live/deploy/" + depHash, "_blank");
    }, 4000);
  };

  return (
    <div>
      <div className="bg-slate-500 h-[420px]">
        {" "}
      </div>
      <div className="relative top-[-100px] container mx-auto">
        <div className="flex justify-center">
          <div className="w-full xl:w-1/2">
            <MoviePageView movie={movie}>
              <div className="flex items-center justify-center pt-20 select-none">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center" onMouseOut={() => setStarsHovered(0)}>
                    {stars.map((num) => (
                      <div key={num} onMouseOver={() => setStarsHovered(num)} onClick={() => placeRating(movie.slug, num)}>
                        <div className="cursor-pointer">
                          { starsHovered >= num && <svg className="w-16 h-16 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M12 2.61l2.98 6.012 6.664.972-4.819 4.7 1.137 6.625-5.982-3.152-5.982 3.152 1.137-6.625-4.819-4.7 6.664-.972z" fill="#FFD700"/>
                            </svg> }
                          { starsHovered < num && <svg className="w-16 h-16 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M12 2.61l2.98 6.012 6.664.972-4.819 4.7 1.137 6.625-5.982-3.152-5.982 3.152 1.137-6.625-4.819-4.7 6.664-.972zm0 2.172l-2.12 4.266-4.735.69 3.426 3.346-.81 4.732 4.25-2.242 4.25 2.242-.81-4.732 3.426-3.346-4.735-.69-2.12-4.266z"/>
                            </svg>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MoviePageView>
          </div>
        </div>
      </div>
    </div>
  );
}
