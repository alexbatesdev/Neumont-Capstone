import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingDisplay from '@/components/LoadingDisplay';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Editor from '@/ClientSidePages/Editor';
import { EditorContextProvider } from '@/contexts/editor-context';
import { toast } from 'react-toastify';

// I cannot tell if the dynamic import helps or hinders the experience

// const Editor = dynamic(
//     () => import('@/ClientSidePages/Editor'),
//     {
//         ssr: false,
//         loading: () => <LoadingDisplay fun />,
//     }
// );


export default function Page() {
    const session = useSession();
    const [projData, setProjData] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    const [userHasEditAccess, setUserHasEditAccess] = React.useState(true);

    // If the user isn't the owner or a collaborator, redirect them to the "view/[project_id]" page
    // Or swap out the components for a read only version of the editor

    const router = useRouter();

    const { project_id } = router.query;

    //This change either made my code way more resilient or way less resilient
    //Right now this works because the files are loaded before the editor is rendered
    //If the editor is rendered before the files are loaded, it may crash
    //We'll see
    useEffect(() => {
        console.log("Loading project");
        const getProject = async () => {
            if (!project_id) {
                console.log("No project ID")
                return;
            }
            //console.log(session.data)
            let endpointURL = `${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${project_id}`
            console.log(endpointURL)
            const response = await fetch(endpointURL, {
                method: 'GET'
            }).then(res => {
                if (!res.ok) throw new Error(res.status)
                return res.json()
            }).then(data => {
                setProjData(data)
                console.log(data)
                setLoading(false)
                if (
                    // IF session.data exists
                    session.data &&
                    // AND session.data.user exists
                    session.data.user &&
                    // AND the user's ID does not match the project owner's ID
                    (session.data.user.account_id != data.project_owner) &&
                    // AND the user's ID is not in the list of collaborators
                    !data.collaborators.includes(session.data.user.account_id)
                ) {
                    console.log("User does not have edit access")
                    // Then the user does not have edit access
                    setUserHasEditAccess(false);
                } else if (session.status == "unauthenticated" || !session.data) {
                    console.log("User does not have edit access")
                    toast.info("Sign in to edit or fork this project")
                    setUserHasEditAccess(false);
                }
            }).catch(err => {
                console.log(err)
                toast.error("Error loading project. Refresh the page to try again.")
            })

        }
        if (session.status != "loading") getProject()
    }, [project_id, session])

    return (<>
        {!loading ? (
            <EditorContextProvider project_in={projData} hasEditAccess={userHasEditAccess}>
                <Editor />
            </EditorContextProvider>
        ) : <LoadingDisplay fun />}
    </>)
    // return <LoadingDisplay fun />
}
