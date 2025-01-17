USE [master]
GO
/****** Object:  Database [PMF]    Script Date: 12/24/2022 2:13:27 PM ******/
CREATE DATABASE [PMF]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PMF', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\PMF.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PMF_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\PMF_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [PMF] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PMF].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PMF] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PMF] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PMF] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PMF] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PMF] SET ARITHABORT OFF 
GO
ALTER DATABASE [PMF] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [PMF] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PMF] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PMF] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PMF] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PMF] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PMF] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PMF] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PMF] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PMF] SET  ENABLE_BROKER 
GO
ALTER DATABASE [PMF] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PMF] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PMF] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PMF] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PMF] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PMF] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [PMF] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PMF] SET RECOVERY FULL 
GO
ALTER DATABASE [PMF] SET  MULTI_USER 
GO
ALTER DATABASE [PMF] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PMF] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PMF] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PMF] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PMF] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PMF] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [PMF] SET QUERY_STORE = OFF
GO
USE [PMF]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[username] [varchar](50) NOT NULL,
	[pass] [varchar](50) NOT NULL,
	[fullname] [nvarchar](250) NOT NULL,
	[createDate] [datetime] NOT NULL,
	[email] [varchar](50) NOT NULL,
	[phone] [varchar](20) NOT NULL,
	[address] [nvarchar](50) NOT NULL,
	[image] [varchar](250) NOT NULL,
	[status] [int] NOT NULL,
	[roleID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Account_Role]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account_Role](
	[roleID] [int] NOT NULL,
	[roleName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Activity]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activity](
	[activityID] [int] IDENTITY(1,1) NOT NULL,
	[objectID] [int] NULL,
	[activityName] [nvarchar](250) NOT NULL,
	[startDate] [datetime] NOT NULL,
	[username] [varchar](50) NULL,
	[discription] [ntext] NULL,
	[projectID] [int] NULL,
	[categoryID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[activityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Activity_Category]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activity_Category](
	[categoryID] [int] NOT NULL,
	[categoryName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[categoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Assigned]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Assigned](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[startDate] [datetime] NOT NULL,
	[username] [varchar](50) NOT NULL,
	[activityID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[activityID] ASC,
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[projectID] [int] IDENTITY(1,1) NOT NULL,
	[projectName] [nvarchar](250) NOT NULL,
	[createDate] [datetime] NULL,
	[endDate] [datetime] NULL,
	[statusID] [int] NOT NULL,
	[securityID] [int] NOT NULL,
	[teamID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[projectID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project_Security]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project_Security](
	[securityID] [int] NOT NULL,
	[securityName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[securityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project_Status]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project_Status](
	[statusID] [int] NOT NULL,
	[statusName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[statusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedule]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedule](
	[jobID] [varchar](250) NOT NULL,
	[cronExpress] [varchar](50) NOT NULL,
	[title] [nvarchar](250) NULL,
	[link] [varchar](max) NULL,
	[description] [ntext] NOT NULL,
	[projectID] [int] NULL,
	[taskID] [int] NULL,
	[username] [varchar](50) NOT NULL,
	[cateID] [int] NOT NULL,
	[status] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[jobID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schedule_Category]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schedule_Category](
	[cateID] [int] NOT NULL,
	[cateName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[cateID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Section]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Section](
	[sectionID] [int] IDENTITY(1,1) NOT NULL,
	[sectionName] [nvarchar](250) NOT NULL,
	[sectionNumber] [int] NOT NULL,
	[projectID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[sectionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task](
	[taskID] [int] IDENTITY(1,1) NOT NULL,
	[taskName] [nvarchar](250) NOT NULL,
	[createDate] [datetime] NOT NULL,
	[plannedStartDate] [datetime] NULL,
	[plannedEndDate] [datetime] NULL,
	[taskNumber] [int] NOT NULL,
	[discription] [ntext] NULL,
	[projectID] [int] NOT NULL,
	[sectionID] [int] NOT NULL,
	[priorityID] [int] NOT NULL,
	[statusID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[taskID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_File]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task_File](
	[fileID] [int] IDENTITY(1,1) NOT NULL,
	[taskID] [int] NOT NULL,
	[projectID] [int] NOT NULL,
	[username] [varchar](50) NOT NULL,
	[createDate] [datetime] NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[status] [bit] NULL,
	[code] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[fileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_Priority]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task_Priority](
	[priorityID] [int] NOT NULL,
	[priorityName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[priorityID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_Status]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task_Status](
	[statusID] [int] NOT NULL,
	[statusName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[statusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task_Sub]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task_Sub](
	[subID] [int] IDENTITY(1,1) NOT NULL,
	[taskID] [int] NOT NULL,
	[discription] [ntext] NULL,
	[status] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[subID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Team]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Team](
	[teamID] [int] IDENTITY(1,1) NOT NULL,
	[teamName] [nvarchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[teamID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Team_Members]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Team_Members](
	[teamID] [int] NOT NULL,
	[username] [varchar](50) NOT NULL,
	[memberID] [int] IDENTITY(1,1) NOT NULL,
	[roleID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[teamID] ASC,
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Team_Role]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Team_Role](
	[roleID] [int] NOT NULL,
	[roleName] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED 
(
	[roleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Web_Security]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Web_Security](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](250) NOT NULL,
	[content] [ntext] NULL,
	[note] [ntext] NULL,
	[statusWeb] [bit] NULL,
	[versionWeb] [float] NULL,
	[startDate] [datetime] NULL,
	[endDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'admin123', N'123456', N'Nguyễn Văn Admin', CAST(N'2022-11-02T01:15:25.427' AS DateTime), N'admin123@gmail.com', N'0123456789', N'Ho Chi Minh city', N'admin.png', 1, 1)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user111', N'123456', N'Nguyễn Thị User1', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'nhavtps16500@fpt.edu.vn', N'0374038128', N'Ho Chi Minh city', N'988557992.jpg', 1, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user123', N'123456', N'Nguyễn Thị User10', CAST(N'2022-11-02T01:15:25.427' AS DateTime), N'mmm@gmail.com', N'0974483670', N'Ho Chi Minh city', N'1691796.jpg', 2, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user222', N'123456', N'Nguyễn Thị User2', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'user222@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user2.jpg', 1, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user333', N'123456', N'Nguyễn Thị User3', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'hungtppps16493@fpt.edu.vn', N'0374038128', N'Ho Chi Minh city', N'user3.jpg', 3, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user444', N'123456', N'Nguyễn Thị User4', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'2002dtn@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user4.jpg', 2, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user555', N'123456', N'Nguyễn Thị User5', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'2002dtn@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user5.jpg', 3, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user666', N'123456', N'Nguyễn Thị User6', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'user666@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user6.jpg', 1, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user777', N'123456', N'Nguyễn Thị User7', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'user777@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user7.jpg', 2, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user888', N'0e5f8ce1-8b99-45cc-9004-a75f383f05d3', N'Nguyễn Thị User8', CAST(N'2022-11-02T01:15:25.427' AS DateTime), N'user888@gmail.com', N'0123456789', N'Ho Chi Minh city', N'user8.png', 1, 2)
INSERT [dbo].[Account] ([username], [pass], [fullname], [createDate], [email], [phone], [address], [image], [status], [roleID]) VALUES (N'user999', N'fba28bea-0107-448f-983c-ac421fce3cb4', N'Nguyễn Thị User9', CAST(N'2022-11-02T00:00:00.000' AS DateTime), N'nhavtps16500@fpt.edu.vn', N'0123456789', N'Ho Chi Minh city', N'image002.png', 1, 2)
GO
INSERT [dbo].[Account_Role] ([roleID], [roleName]) VALUES (1, N'Admin')
INSERT [dbo].[Account_Role] ([roleID], [roleName]) VALUES (2, N'User')
GO
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (1, N'Create project')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (2, N'Create section')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (3, N'Create task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (4, N'Move section')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (5, N'Move task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (6, N'Invite people')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (7, N'Confirm invitation')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (8, N'Decline invitation')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (9, N'Assign task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (10, N'Confirm assigned task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (11, N'Decline assigned task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (12, N'Assign subtask')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (13, N'Confirm assigned subtask')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (14, N'Decline assigned subtask')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (15, N'Comment')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (16, N'Set task start date')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (17, N'Set task end date')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (18, N'Set task priority')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (19, N'Set task status')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (20, N'Set task status description')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (21, N'Remove member')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (22, N'Cancel task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (23, N'Cancel subtask')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (24, N'Change section name')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (25, N'Change task name')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (26, N'Change subtask name')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (27, N'Delete section')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (28, N'Delete task')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (29, N'Delete subtask')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (30, N'Shut down project')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (31, N'Active project')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (97, N'Update project status')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (98, N'Enable Account')
INSERT [dbo].[Activity_Category] ([categoryID], [categoryName]) VALUES (99, N'Unlock Premium')
GO
INSERT [dbo].[Project_Security] ([securityID], [securityName]) VALUES (1, N'Public')
INSERT [dbo].[Project_Security] ([securityID], [securityName]) VALUES (2, N'Private')
GO
INSERT [dbo].[Project_Status] ([statusID], [statusName]) VALUES (1, N'Active')
INSERT [dbo].[Project_Status] ([statusID], [statusName]) VALUES (2, N'In-active')
GO
INSERT [dbo].[Schedule_Category] ([cateID], [cateName]) VALUES (1, N'Task')
INSERT [dbo].[Schedule_Category] ([cateID], [cateName]) VALUES (2, N'Meeting')
GO
INSERT [dbo].[Task_Priority] ([priorityID], [priorityName]) VALUES (1, N'Low')
INSERT [dbo].[Task_Priority] ([priorityID], [priorityName]) VALUES (2, N'Medium')
INSERT [dbo].[Task_Priority] ([priorityID], [priorityName]) VALUES (3, N'High')
GO
INSERT [dbo].[Task_Status] ([statusID], [statusName]) VALUES (1, N'On track')
INSERT [dbo].[Task_Status] ([statusID], [statusName]) VALUES (2, N'At risk')
INSERT [dbo].[Task_Status] ([statusID], [statusName]) VALUES (3, N'Off track')
INSERT [dbo].[Task_Status] ([statusID], [statusName]) VALUES (4, N'Approved')
GO
INSERT [dbo].[Team_Role] ([roleID], [roleName]) VALUES (1, N'Project Owner')
INSERT [dbo].[Team_Role] ([roleID], [roleName]) VALUES (2, N'Project Member')
GO
SET IDENTITY_INSERT [dbo].[Web_Security] ON 

INSERT [dbo].[Web_Security] ([id], [name], [content], [note], [statusWeb], [versionWeb], [startDate], [endDate]) VALUES (1, N'ádsdaadsasd', N'sdaasdasđâsdasd. Nhã gà', N'ádadsdasasd', 0, 0, CAST(N'2022-11-18T01:50:00.000' AS DateTime), CAST(N'2022-11-18T01:51:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Web_Security] OFF
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT (getdate()) FOR [createDate]
GO
ALTER TABLE [dbo].[Activity] ADD  DEFAULT (getdate()) FOR [startDate]
GO
ALTER TABLE [dbo].[Assigned] ADD  DEFAULT (getdate()) FOR [startDate]
GO
ALTER TABLE [dbo].[Account]  WITH CHECK ADD  CONSTRAINT [FK_Account_Account_Role] FOREIGN KEY([roleID])
REFERENCES [dbo].[Account_Role] ([roleID])
GO
ALTER TABLE [dbo].[Account] CHECK CONSTRAINT [FK_Account_Account_Role]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK_Activity_Activity_Category] FOREIGN KEY([categoryID])
REFERENCES [dbo].[Activity_Category] ([categoryID])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK_Activity_Activity_Category]
GO
ALTER TABLE [dbo].[Assigned]  WITH CHECK ADD  CONSTRAINT [FK_Assigned_Activity] FOREIGN KEY([activityID])
REFERENCES [dbo].[Activity] ([activityID])
GO
ALTER TABLE [dbo].[Assigned] CHECK CONSTRAINT [FK_Assigned_Activity]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD  CONSTRAINT [FK_Project_Project_Security] FOREIGN KEY([securityID])
REFERENCES [dbo].[Project_Security] ([securityID])
GO
ALTER TABLE [dbo].[Project] CHECK CONSTRAINT [FK_Project_Project_Security]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD  CONSTRAINT [FK_Project_Project_Status] FOREIGN KEY([statusID])
REFERENCES [dbo].[Project_Status] ([statusID])
GO
ALTER TABLE [dbo].[Project] CHECK CONSTRAINT [FK_Project_Project_Status]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD  CONSTRAINT [FK_Project_Team] FOREIGN KEY([teamID])
REFERENCES [dbo].[Team] ([teamID])
GO
ALTER TABLE [dbo].[Project] CHECK CONSTRAINT [FK_Project_Team]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Account] FOREIGN KEY([username])
REFERENCES [dbo].[Account] ([username])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Account]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Project] FOREIGN KEY([projectID])
REFERENCES [dbo].[Project] ([projectID])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Project]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Schedule_Category] FOREIGN KEY([cateID])
REFERENCES [dbo].[Schedule_Category] ([cateID])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Schedule_Category]
GO
ALTER TABLE [dbo].[Schedule]  WITH CHECK ADD  CONSTRAINT [FK_Schedule_Task] FOREIGN KEY([taskID])
REFERENCES [dbo].[Task] ([taskID])
GO
ALTER TABLE [dbo].[Schedule] CHECK CONSTRAINT [FK_Schedule_Task]
GO
ALTER TABLE [dbo].[Section]  WITH CHECK ADD  CONSTRAINT [FK_Section_Project] FOREIGN KEY([projectID])
REFERENCES [dbo].[Project] ([projectID])
GO
ALTER TABLE [dbo].[Section] CHECK CONSTRAINT [FK_Section_Project]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_Task_Section] FOREIGN KEY([sectionID])
REFERENCES [dbo].[Section] ([sectionID])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_Task_Section]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_Task_Task_Priority] FOREIGN KEY([priorityID])
REFERENCES [dbo].[Task_Priority] ([priorityID])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_Task_Task_Priority]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_Task_Task_Status] FOREIGN KEY([statusID])
REFERENCES [dbo].[Task_Status] ([statusID])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_Task_Task_Status]
GO
ALTER TABLE [dbo].[Task_File]  WITH CHECK ADD  CONSTRAINT [fk_taskFile_account] FOREIGN KEY([username])
REFERENCES [dbo].[Account] ([username])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Task_File] CHECK CONSTRAINT [fk_taskFile_account]
GO
ALTER TABLE [dbo].[Task_File]  WITH CHECK ADD  CONSTRAINT [fk_taskFile_project] FOREIGN KEY([projectID])
REFERENCES [dbo].[Project] ([projectID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Task_File] CHECK CONSTRAINT [fk_taskFile_project]
GO
ALTER TABLE [dbo].[Task_File]  WITH CHECK ADD  CONSTRAINT [fk_taskFile_task] FOREIGN KEY([taskID])
REFERENCES [dbo].[Task] ([taskID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Task_File] CHECK CONSTRAINT [fk_taskFile_task]
GO
ALTER TABLE [dbo].[Task_Sub]  WITH CHECK ADD  CONSTRAINT [FK_Task_Sub_Task] FOREIGN KEY([taskID])
REFERENCES [dbo].[Task] ([taskID])
GO
ALTER TABLE [dbo].[Task_Sub] CHECK CONSTRAINT [FK_Task_Sub_Task]
GO
ALTER TABLE [dbo].[Team_Members]  WITH CHECK ADD  CONSTRAINT [FK_Team_Members_Account] FOREIGN KEY([username])
REFERENCES [dbo].[Account] ([username])
GO
ALTER TABLE [dbo].[Team_Members] CHECK CONSTRAINT [FK_Team_Members_Account]
GO
ALTER TABLE [dbo].[Team_Members]  WITH CHECK ADD  CONSTRAINT [FK_Team_Members_Team] FOREIGN KEY([teamID])
REFERENCES [dbo].[Team] ([teamID])
GO
ALTER TABLE [dbo].[Team_Members] CHECK CONSTRAINT [FK_Team_Members_Team]
GO
ALTER TABLE [dbo].[Team_Members]  WITH CHECK ADD  CONSTRAINT [FK_Team_Members_Team_Role] FOREIGN KEY([roleID])
REFERENCES [dbo].[Team_Role] ([roleID])
GO
ALTER TABLE [dbo].[Team_Members] CHECK CONSTRAINT [FK_Team_Members_Team_Role]
GO
/****** Object:  StoredProcedure [dbo].[PMF_Report1_Admin]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[PMF_Report1_Admin]
As
begin
SELECT count(pr.projectID)as N'Tổng dự án', tm.username, ac.fullname, ac.image FROM Project pr inner join Team t on pr.teamID = t.teamID inner join Team_Members tm on t.teamID = tm.teamID 
inner join Account ac on tm.username = ac.username  group by  tm.username ,ac.fullname, ac.image ORDER BY count(pr.projectID) DESC
end
GO
/****** Object:  StoredProcedure [dbo].[PMF_Top1_User]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[PMF_Top1_User]
As
begin
SELECT TOP 1 count(pr.projectID)as N'Tổng dự án', tm.username, ac.fullname FROM Project pr inner join Team t on pr.teamID = t.teamID inner join Team_Members tm on t.teamID = tm.teamID 
inner join Account ac on tm.username = ac.username  group by  tm.username ,ac.fullname ORDER BY count(pr.projectID) DESC
end
GO
/****** Object:  StoredProcedure [dbo].[proceduce_GetAllActivitiesRelevantToInvitationInfor]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[proceduce_GetAllActivitiesRelevantToInvitationInfor](@projectID int,@username varchar(50),@email varchar(50))
as
begin
	DECLARE @MyVariable VARCHAR(50);
	SET @MyVariable = @email;
	if exists ( select* from Account ac,Activity act,Project pj,Team t,Team_Members tm,Assigned ass
					where 
					 act.activityID = ass.activityID and
					 pj.projectID = act.projectID and
				     pj.teamID = t.teamID and
					 t.teamID = tm.teamID and 
					 ac.username = tm.username and
					 ac.email = @email)
	begin
		SET @MyVariable = null;
	end

	Select  * from  Activity
	where
		(Activity.categoryID = 6 or Activity.categoryID = 7 or Activity.categoryID = 8 or Activity.categoryID =21)
		and Activity.projectID = @projectID and (Activity.username = @username or Activity.username = @MyVariable)

		

end
GO
/****** Object:  StoredProcedure [dbo].[proceduce_GetAllActivitiesRelevantToProjectAndAccount]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[proceduce_GetAllActivitiesRelevantToProjectAndAccount](@projectID int, @username varchar(50))
as
begin
	Select * from Activity, project, team, team_members, account
	where
		activity.projectID = project.projectID and
		project.teamID = team.teamID and
		Team_Members.teamID = team.teamID and
		Account.username = Team_Members.username and
		Account.username like @username and
		activity.projectID = @projectID
end
GO
/****** Object:  StoredProcedure [dbo].[proceduce_GetAllActivitiesRelevantToTaskAndProject]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[proceduce_GetAllActivitiesRelevantToTaskAndProject](@projectID int, @taskID int)
as
begin
	Select * from Activity, project, team, team_members, account
	where
		activity.projectID = project.projectID and
		project.teamID = team.teamID and
		Team_Members.teamID = team.teamID and
		Account.username = Team_Members.username and
		Account.username = activity.username and
		activity.projectID = @projectID and
		activity.objectID = @taskID 
end
GO
/****** Object:  StoredProcedure [dbo].[proceduce_GetAllProjectsRelevantToAccount]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[proceduce_GetAllProjectsRelevantToAccount](@username varchar(50))
as
begin
	Select * from project, team, team_members, account
	where
		project.teamID = team.teamID and
		Team_Members.teamID = team.teamID and
		Account.username = Team_Members.username and
		Account.username like @username
end
GO
/****** Object:  StoredProcedure [dbo].[proceduce_GetAllProjectsRelevantToAccountPrivate]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[proceduce_GetAllProjectsRelevantToAccountPrivate](@username varchar(50),@email varchar(50))
as
begin
	DECLARE @MyVariable VARCHAR(50);
	SET @MyVariable = @email;
	if exists ( select* from Account ac,Activity act,Project pj,Team t,Team_Members tm,Assigned ass
					where 
					 act.activityID = ass.activityID and
					 pj.projectID = act.projectID and
				     pj.teamID = t.teamID and
					 t.teamID = tm.teamID and 
					 ac.username = tm.username and
					 ac.email = @email)
	begin
		SET @MyVariable = null;
	end

	Select distinct project.projectID from project, Activity, Assigned
	where
		Activity.projectID = project.projectID and
		Assigned.activityID = Activity.activityID and
		Activity.categoryID not in (8) and Activity.categoryID not in (21) and
		(Activity.username = @username or Activity.username = @MyVariable or Assigned.username = @username)
		

end
GO
/****** Object:  StoredProcedure [dbo].[sp_DataLastWeb]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Search the end of sql
create proc [dbo].[sp_DataLastWeb] 
As
begin
	SELECT TOP 1 * FROM Web_Security ORDER BY ID DESC
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindAccountDataForAdmin]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_FindAccountDataForAdmin]
	(@DieuKien nvarchar(100)) 
As
begin
	if(@DieuKien Like '%banned%')
		begin
			SELECT * FROM Account acc
			WHERE acc.status = 3
		end
	if(@DieuKien Like '%trial%')
		begin
			SELECT * FROM Account acc
			WHERE  acc.status = 1
		end
	if(@DieuKien Like '%premium%')
		begin
			SELECT * FROM Account acc
			WHERE acc.status = 2
		end
	else
		begin
			SELECT * FROM Account acc
			WHERE (acc.username LIKE '%'+@DieuKien+'%'
			OR acc.fullname LIKE '%'+@DieuKien+'%'
			OR acc.email LIKE '%'+@DieuKien+'%'
			OR acc.phone LIKE '%'+@DieuKien+'%') 
		end
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindAccountPaid]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- TIm kiem nguoi dung da thanh toan o trang admin
create proc [dbo].[sp_FindAccountPaid]
	(@DieuKien nvarchar(100)) 
As
begin
	SELECT * from Activity act 
	WHERE (act.username LIKE '%'+@DieuKien+'%' 
	OR act.activityName LIKE '%'+@DieuKien+'%'
	OR act.startDate LIKE '%'+@DieuKien+'%')
	AND act.categoryID  = 99  
	order by act.startDate desc
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindActivityData]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_FindActivityData]
	(@DieuKien nvarchar(100)) 
As
begin
	SELECT * from Activity act 
	inner join Activity_Category acate on acate.categoryID = act.categoryID
	where (act.username LIKE '%'+@DieuKien+'%' 
	OR act.discription LIKE '%'+@DieuKien+'%'
	OR acate.categoryName LIKE '%'+@DieuKien+'%'
	OR act.activityID LIKE '%'+@DieuKien+'%'
	OR act.discription LIKE '%'+@DieuKien+'%'
	OR act.activityName LIKE '%'+@DieuKien+'%'
	OR act.startDate LIKE '%'+@DieuKien+'%')
	and(act.categoryID  = 1 
	or act.categoryID  = 98 
	or act.categoryID  = 99
    or act.categoryID = 97)
	order by act.startDate desc

	SELECT * from Activity act 
	WHERE (act.username LIKE '%'+@DieuKien+'%' 
	OR act.activityName LIKE '%'+@DieuKien+'%'
	OR act.startDate LIKE '%'+@DieuKien+'%')
	AND act.categoryID  = 99  
	order by act.startDate desc
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindAssigneeFromAssigned]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_FindAssigneeFromAssigned]
	(@projectID int, @username nvarchar(50) )
As
begin
	select * from Activity 
	where (categoryID = 9 or categoryID = 10 or categoryID = 11 or categoryID = 12 or categoryID = 13 or categoryID = 14)
	and projectID = @projectID and username = @username
	order by activityID desc
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindDataAccount]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_FindDataAccount]
	(@DieuKien nvarchar(100),@Username varchar(100)) 
As
begin
	SELECT distinct ac.username FROM Account ac INNER JOIN Team_Members TM ON ac.username = TM.username 
	WHERE (EMAIL LIKE '%'+@DieuKien+'%' or FULLNAME LIKE '%'+@DieuKien+'%' 
	or phONe LIKE '%'+@DieuKien+'%') AND TM.username LIKE @Username
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindDataProject]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--Find data by name project in table Project
create proc [dbo].[sp_FindDataProject]
	(@DieuKien nvarchar(100),@Username varchar(100)) 
As
begin
	SELECT * FROM PROJECT PR INNER JOIN Team T ON PR.teamID = T.teamID INNER JOIN Team_Members TM ON T.teamID = TM.teamID WHERE PR.PROJECTNAME LIKE '%'+@DieuKien+'%'
	AND TM.username LIKE @Username
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindDataTask]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Find data by name task in table Task
CREATE proc [dbo].[sp_FindDataTask]
	(@DieuKien nvarchar(100),@Username varchar(100)) 
As
begin
	SELECT *  FROM TASK t 
	INNER JOIN Project pro ON t.projectID=pro.projectID 
	INNER JOIN Team te ON te.teamID = pro.teamID 
	INNER JOIN Team_Members TM ON TM.teamID = te.teamID
	WHERE (TASKNAME LIKE '%'+@DieuKien+'%' 
	OR discriptiON LIKE '%'+@DieuKien+'%') AND TM.username LIKE @Username 
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindDataTaskSub]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Find data by disciptiON in table Task_Sub
create proc [dbo].[sp_FindDataTaskSub]
	(@DieuKien nvarchar(100),@Username varchar(100)) 
As
begin
	SELECT * FROM Task_Sub TS INNER JOIN TASK T ON T.taskID = TS.taskID INNER JOIN SECTION SC ON SC.sectionID =T.sectionID
	INNER JOIN PROJECT PRO ON SC.projectID=PRO.projectID INNER JOIN TEAM TE ON TE.teamID =PRO.teamID INNER JOIN Team_Members TMS ON TMS.teamID=TE.teamID
	WHERE TS.discriptiON LIKE '%'+@DieuKien+'%' AND TMS.username LIKE @Username
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindDataTeam]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--Find data by name team in table Team
create proc [dbo].[sp_FindDataTeam]
	(@DieuKien nvarchar(100),@Username varchar(100)) 
As
begin
	SELECT * FROM TEAM INNER JOIN Team_Members TM ON TEAM.teamID=TM.teamID WHERE TEAMNAME LIKE '%'+@DieuKien+'%'
	AND TM.username LIKE @Username
end
GO
/****** Object:  StoredProcedure [dbo].[sp_findDateSchedule]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[sp_findDateSchedule]
@DIEUKIEN nvarchar(100)
as
begin
select * from schedule where username like @DIEUKIEN
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindMemberData]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_FindMemberData]
	(@DieuKien nvarchar(100), @pid int) 
As
begin
	SELECT * FROM Team_Members tm
	INNER JOIN Team t ON t.teamID = tm.teamID
	INNER JOIN Project pr ON pr.teamID = t.teamID
	Inner join Account acc on acc.username = tm.username
	WHERE (acc.username LIKE '%'+@DieuKien+'%' 
	OR acc.fullname LIKE '%'+@DieuKien+'%') AND pr.projectID LIKE @pid
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindProjectData]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_FindProjectData]
	(@DieuKien nvarchar(100)) 
As
begin
	SELECT * FROM Project pr
	INNER JOIN Project_Status ps ON ps.statusID = pr.statusID
	INNER JOIN Team t ON t.teamID = pr.teamID
	WHERE (pr.projectName LIKE '%'+@DieuKien+'%' 
	OR pr.createDate LIKE '%'+@DieuKien+'%'
	OR t.teamName LIKE '%'+@DieuKien+'%'
	OR ps.statusName LIKE '%'+@DieuKien+'%')
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindSubTaskFromAssigned]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_FindSubTaskFromAssigned]
	(@projectID int, @taskID int) 
As
begin
	select Top 1  * from Activity 
	where (categoryID = 12 or categoryID = 13 or categoryID = 14 or categoryID = 23)
	and projectID = @projectID and objectID = @taskID
	order by activityID desc
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindTaskFromAssigned]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[sp_FindTaskFromAssigned]
	(@projectID int, @taskID int) 
As
begin
	select Top 1  * from Activity 
	where (categoryID = 9 or categoryID = 10 or categoryID =11)
	and projectID = @projectID and objectID = @taskID
	order by activityID desc
end
GO
/****** Object:  StoredProcedure [dbo].[sp_FindTaskOverdue]    Script Date: 12/24/2022 2:13:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[sp_FindTaskOverdue]
	(@projectID int, @taskID int )
As
begin
	select Top 1 * from Activity 
	where (categoryID = 19)
	and projectID = @projectID and objectID = @taskID
	order by activityID desc
end
GO
USE [master]
GO
ALTER DATABASE [PMF] SET  READ_WRITE 
GO
