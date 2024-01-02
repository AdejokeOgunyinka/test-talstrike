import { useState, useRef } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import SettingsIcon from "@/assets/settings.svg";
import AnnouncementIcon from "@/assets/announcements.svg";
import BellIcon from "@/assets/bell.svg";
import FollwersIcons from "@/assets/followers.svg";
import LoveIcon from "@/assets/love.svg";
import MentionsIcon from "@/assets/mentions.svg";
import NotificationIcon from "@/assets/notification.svg";
import ReplyIcon from "@/assets/reply.svg";
import ModalContainer from "@/components/Modal";
import { Modal } from "@chakra-ui/react";
import { useTypedSelector } from "@/hooks/hooks";


const Image = styled.img``;
const Pill = styled.div `
display: flex;
padding: 7px 31px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 50px;
border: 1px solid var(--Stroke, #CDCDCD);
background: var(--bg-grey, #F4F4F4);
margin-right:8px;
margin-bottom: 10px;
cursor: pointer;
`

const SelectedPill = styled.div `
display: flex;
padding: 7px 31px;
justify-content: center;
align-items: center;
color: #fff;
gap: 10px;
border-radius: 50px;
border: 1px solid var(--Text, #293137);
background: var(--Text, #293137);
margin-right:10px;
margin-bottom: 10px;
`

const NotificationLayout = styled.div `
display: inline-flex;
left: 55%;
position: absolute;
height: 713px;
padding:40px;
width: 577px;
flex-direction: column;
flex-shrink: 0;
border-radius: 16px;
border: 1px solid var(--Stroke, #CDCDCD);
background: var(--White, #FFF);
box-shadow: 0px 4px 40px 2px rgba(0, 0, 0, 0.08);
`

const NotificationHeader = styled.div `
color: var(--Text, #293137);
font-family: Poppins;
font-size: 28px;
font-style: normal;
font-weight: 600;
line-height: normal;
`

const NotificationCount = styled.div `
color: var(--green, #00B127);
font-family: Poppins;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;
vertical-align: middle;
padding-left:30px;
padding-top:5px;
`
const NotificationHeaderLayout = styled.div `
display: inline-flex;
flex-wrap: wrap;
margin-top: 20px;
`

const NotificationContentDiv = styled.div `
display: inline-flex;
flex-wrap: wrap;
margin-top: 20px;
`

const NotificationDefaultContentDiv = styled.div `
margin-top: 20px;
`

const NotificationDefaultContentHeader = styled.div `
color: var(--Text, #293137);
text-align: center;
font-family: Poppins;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 186.5%; /* 33.57px */
`

const NotificationDefaultContentText = styled.div `
width: 420px;
height: 70px;
flex-shrink: 0;
color: var(--grey-1, #93A3B1);
text-align: center;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 186.5%; /* 29.84px */
`


const NotificationModal = () => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);
  const [content, setContent] = useState(<></>);
  const [defaultIcon, setDefaultIcon] = useState(<></>);
  const [defaultContentHeader, setDefaultContentHeader] = useState(<></>);
  const [defaultContent, setDefaultContent] = useState(<></>);
  const [isContentSet, setIsContentSet] = useState(false)
  
  const defaultIconRef = useRef(<></>);
  const defaultContentHeaderRef = useRef(<></>);
  const defaultContentRef = useRef(<></>);

  const emptyContent={
    "all":  {"title":"All Notifications", "details":"When other athletes interact with your post, follows or tags you, you will get notified here.", "icon": <BellIcon /> },
    "likes":  {"title":"Likes on your posts", "details":"When someone likes any of your posts, you'll see it here.", "icon": <LoveIcon /> },
    "comments":  {"title":"Comments & Replies", "details": "When someone comments or replies to your comments you'll see them here.", "icon": <ReplyIcon /> },
    "followers":  {"title":"New Followers", "details": "When other athletes follow you, you'll see them here.", "icon": <FollwersIcons /> },
    "tags":  {"title":"Tags & Mentions", "details": "When other athletes tag or mention you in posts, you'll see them here.", "icon": <MentionsIcon /> },
    "announcements":  {"title":"Announcements", "details": "When other athletes make announcements that is relevant to your interest, you be notified here.", "icon": <AnnouncementIcon /> },

  }

  

  const TOKEN = session?.user?.access;


const setEmptyContent = (content_type)=>{
  console.log("I got here")
  const empty = emptyContent[content_type];
  console.log(empty);
    
  defaultIconRef.current = <NextImage src={empty.icon} alt="default icon" />
  defaultContentHeaderRef.current = <NotificationDefaultContentHeader>{empty.title}</NotificationDefaultContentHeader>
  defaultContentRef.current = <NotificationDefaultContentText>{empty.details}</NotificationDefaultContentText>
  
   
  
  
}

  return (
    <ModalContainer>
      <NotificationLayout>
        <NotificationHeaderLayout>
        <NotificationHeader>Notification</NotificationHeader>
        <NotificationCount className="grow">5 New </NotificationCount>
        <div><NextImage src={SettingsIcon} alt="settings" /></div>
        </NotificationHeaderLayout>
        <NotificationHeaderLayout>
        <SelectedPill onClick={setEmptyContent("all")}>All</SelectedPill>
        <Pill onClick={setEmptyContent("likes")}>Likes</Pill>
        <Pill onClick={setEmptyContent("comments")}>Comments</Pill>
        <Pill onClick={setEmptyContent("followers")}>Followers</Pill>
        <Pill onClick={setEmptyContent("tags")}>Tags & Mentions</Pill>
        <Pill onClick={setEmptyContent("announcements")}>Announcements</Pill>
      </NotificationHeaderLayout>
      <NotificationContentDiv>
        <NotificationDefaultContentDiv>
          {defaultIconRef.current}
          {defaultContentHeaderRef.current}
          {defaultContentRef.current}
        </NotificationDefaultContentDiv>
      </NotificationContentDiv>
      </NotificationLayout>
      
      
    </ModalContainer>
  );
};

export default NotificationModal;
