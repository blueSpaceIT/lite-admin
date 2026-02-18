import { Button } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../../components/common/Table/Table";
import TitleCard from "../../../components/common/TitleCard/TitleCard";
import { homeVideoSectionService } from "../../../store/services/homeVideoSectionService";
import type { TError, TMeta, TTableData, TTableHeadingData } from "../../../types";
import type { IHomeVideoSection } from "../../../types/homeVideoSection.types";

const ActionBtns = ({ item }: { item: IHomeVideoSection }) => {
    const [deleteHomeVideoSection] = homeVideoSectionService.useDeleteHomeVideoSectionMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete section: ${item.title}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteHomeVideoSection(item.id);
                if (response?.error) {
                    toast.error((response?.error as TError)?.data?.message || "Delete failed");
                }
                if (response?.data?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Section has been deleted.",
                        icon: "success",
                    });
                }
            }
        });
    };

    return (
        <div className="flex justify-center items-center gap-3">
            <Link to={`/home-video-sections-update/${item.id}`}>
                <Button
                    type="button"
                    className="text-blue-600 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                    title="Edit Section"
                >
                    <FaEdit className="w-3 h-3" />
                </Button>
            </Link>
            <Button
                type="button"
                onClick={handleDelete}
                className="text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center cursor-pointer"
                title="Delete Section"
            >
                <FaTrashAlt className="w-3 h-3" />
            </Button>
        </div>
    );
};

const HomeVideoSections: React.FC = () => {
    const [data, setData] = useState<IHomeVideoSection[]>([]);
    const [meta, setMeta] = useState<TMeta>({
        page: 1,
        limit: 20,
        totalPage: 1,
        totalDoc: 0,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: sectionData, isSuccess, isLoading, isFetching } =
        homeVideoSectionService.useGetHomeVideoSectionsQuery(
            [...searchParams]
        );

    useEffect(() => {
        if (isSuccess && sectionData?.success) {
            setData(sectionData?.data || []);
            if (sectionData?.meta) {
                setMeta(sectionData.meta);
            }
        }
    }, [isSuccess, sectionData]);

    const tableHeadingData: TTableHeadingData = [
        "Title",
        "Videos Count",
        "CTA Label",
        "Action",
    ];

    const tableData: TTableData = [];
    const sections = Array.isArray(data) ? data : [];

    sections.forEach((item: IHomeVideoSection) => {
        tableData.push([
            item.title,
            item.videos?.length || 0,
            item.ctaButtonLabel,
            <ActionBtns item={item} />,
        ]);
    });

    return (
        <div className="mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-2xl font-bold">
                    Home Video Sections
                </h3>
            </TitleCard>
            <div className="flex justify-end items-center gap-2 mb-6">
                <Link to={"/home-video-sections-create"}>
                    <Button className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer">
                        Add Section
                    </Button>
                </Link>
            </div>

            <Table
                title="Home Video Sections"
                data={tableData}
                headingData={tableHeadingData}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                meta={meta}
                loading={isFetching || isLoading}
                path="/home-video-sections"
            />
        </div>
    );
};

export default HomeVideoSections;
