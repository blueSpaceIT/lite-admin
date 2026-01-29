import { useEffect, useState } from "react";
import type { TError, TMarquee } from "../../../types";
import { marqueeService } from "../../../store/services/marqueeService";
import { MarqueeResolvers } from "../../../resolvers/marquee.resolvers";
import type z from "zod";
import toast from "react-hot-toast";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import Loader from "../../../components/common/Loader/Loader";
import Form from "../../../components/common/Form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../../../components/common/Form/FormButton";
import TagField from "../../../components/common/Form/TagField";
import SerialField from "../../../components/common/Form/SerialField";

const Headlines = () => {
    const [headline, setHeadline] = useState<TMarquee | null>(null);
    const { data, isSuccess } = marqueeService.useGetMarqueeQuery("marquee");

    useEffect(() => {
        if (isSuccess && data?.success) {
            setHeadline(data?.data);
        }
    }, [isSuccess, data]);

    const defaultValues = {
        messages: headline?.messages || null,
    };

    type TMarqueeFromData = z.infer<
        typeof MarqueeResolvers.marqueeValidationSchema
    >;

    const [createMarquee] = marqueeService.useCreateMarqueeMutation();

    const createMarqueeHandler = async (data: TMarqueeFromData) => {
        const toastId = toast.loading("Wait a while");
        const result = await createMarquee(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Update successfull", {
                id: toastId,
            });
        }

        window.location.href = "/headlines";
    };

    return (
        <div className="max-w-[520px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Headlines
                </h3>
            </TitleCard>

            {headline ? (
                <div className="grid gap-6">
                    <Form<TMarqueeFromData>
                        onSubmit={createMarqueeHandler}
                        defaultValues={defaultValues}
                        resolver={zodResolver(
                            MarqueeResolvers.marqueeValidationSchema
                        )}
                    >
                        <TagField
                            name="messages"
                            placeholder="Messages"
                            label="Messages"
                        />
                        <FormButton>Update Headlines</FormButton>
                    </Form>
                    <Form<TMarqueeFromData>
                        onSubmit={createMarqueeHandler}
                        defaultValues={defaultValues}
                        resolver={zodResolver(
                            MarqueeResolvers.marqueeValidationSchema
                        )}
                    >
                        <SerialField
                            name="messages"
                            label="Messages"
                            content={headline?.messages}
                        />
                        <FormButton>Update Headlines</FormButton>
                    </Form>
                </div>
            ) : (
                <div className="flex justify-center mt-12 mb-5">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Headlines;
