```sql
-- =============================================
-- UNIVERSITY VISITOR MANAGEMENT SYSTEM DATABASE
-- SQL SERVER CREATE SCRIPT
-- =============================================


-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
CREATE TABLE Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    DepartmentCode NVARCHAR(20) UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Mobile NVARCHAR(15),
    PasswordHash NVARCHAR(500) NOT NULL,

    RoleId INT NOT NULL,
    DepartmentId INT NULL,

    IsActive BIT DEFAULT 1,

    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    LastLoginAt DATETIME NULL,

    CONSTRAINT FK_Users_Roles
        FOREIGN KEY (RoleId)
        REFERENCES Roles(RoleId),

    CONSTRAINT FK_Users_Departments
        FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId)
);

-- =============================================
-- VISIT STATUS TABLE
-- =============================================
CREATE TABLE VisitStatus (
    VisitStatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE
);

-- =============================================
-- VISITORS TABLE
-- =============================================
CREATE TABLE Visitors (
    VisitorId INT IDENTITY(1,1) PRIMARY KEY,

    FullName NVARCHAR(100) NOT NULL,
    Mobile NVARCHAR(15) NOT NULL,
    Email NVARCHAR(100),

    Gender NVARCHAR(20),
    Address NVARCHAR(300),

    IDProofType NVARCHAR(50),
    IDProofNumber NVARCHAR(100),

    PhotoPath NVARCHAR(500),
    FaceEncoding NVARCHAR(MAX),

    IsBlacklisted BIT DEFAULT 0,

    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,

    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME NULL
);

-- =============================================
-- VISITS TABLE
-- =============================================
CREATE TABLE Visits (
    VisitId INT IDENTITY(1,1) PRIMARY KEY,

    VisitorId INT NOT NULL,
    HostUserId INT NOT NULL,
    DepartmentId INT NOT NULL,

    Purpose NVARCHAR(300),

    VisitDate DATE DEFAULT GETDATE(),

    CheckInTime DATETIME NULL,
    CheckOutTime DATETIME NULL,

    VisitStatusId INT NOT NULL,

    GatePassNumber NVARCHAR(50),
    QRCodePath NVARCHAR(500),

    ApprovalStatus NVARCHAR(50) DEFAULT 'Pending',

    ApprovedBy INT NULL,
    ApprovedAt DATETIME NULL,

    CreatedBy INT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,

    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME NULL,

    CONSTRAINT FK_Visits_Visitors
        FOREIGN KEY (VisitorId)
        REFERENCES Visitors(VisitorId),

    CONSTRAINT FK_Visits_HostUsers
        FOREIGN KEY (HostUserId)
        REFERENCES Users(UserId),

    CONSTRAINT FK_Visits_Departments
        FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId),

    CONSTRAINT FK_Visits_Status
        FOREIGN KEY (VisitStatusId)
        REFERENCES VisitStatus(VisitStatusId),

    CONSTRAINT FK_Visits_ApprovedBy
        FOREIGN KEY (ApprovedBy)
        REFERENCES Users(UserId)
);

-- =============================================
-- APPROVALS TABLE
-- =============================================
CREATE TABLE Approvals (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,

    VisitId INT NOT NULL,
    ApproverUserId INT NOT NULL,

    Status NVARCHAR(50) NOT NULL,
    Remarks NVARCHAR(500),

    ActionTime DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Approvals_Visits
        FOREIGN KEY (VisitId)
        REFERENCES Visits(VisitId),

    CONSTRAINT FK_Approvals_Users
        FOREIGN KEY (ApproverUserId)
        REFERENCES Users(UserId)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    Title NVARCHAR(200),
    Message NVARCHAR(MAX),

    IsRead BIT DEFAULT 0,

    SentAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE AuditLogs (
    AuditId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NULL,

    Action NVARCHAR(100),
    Module NVARCHAR(100),

    RecordId INT NULL,

    OldData NVARCHAR(MAX),
    NewData NVARCHAR(MAX),

    IPAddress NVARCHAR(100),

    ActionTime DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_AuditLogs_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);

-- =============================================
-- GATE PASSES TABLE
-- =============================================
CREATE TABLE GatePasses (
    GatePassId INT IDENTITY(1,1) PRIMARY KEY,

    VisitId INT NOT NULL,

    PassNumber NVARCHAR(50) NOT NULL UNIQUE,

    QRCodePath NVARCHAR(500),

    GeneratedAt DATETIME DEFAULT GETDATE(),

    PrintedBy INT NULL,

    CONSTRAINT FK_GatePasses_Visits
        FOREIGN KEY (VisitId)
        REFERENCES Visits(VisitId),

    CONSTRAINT FK_GatePasses_PrintedBy
        FOREIGN KEY (PrintedBy)
        REFERENCES Users(UserId)
);

-- =============================================
-- FACE RECOGNITION LOGS TABLE
-- =============================================
CREATE TABLE FaceRecognitionLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,

    VisitorId INT NULL,
    VisitId INT NULL,

    ConfidenceScore DECIMAL(5,2),

    RecognitionStatus NVARCHAR(50),

    CameraLocation NVARCHAR(100),

    CapturedImagePath NVARCHAR(500),

    RecognitionTime DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_FaceLogs_Visitors
        FOREIGN KEY (VisitorId)
        REFERENCES Visitors(VisitorId),

    CONSTRAINT FK_FaceLogs_Visits
        FOREIGN KEY (VisitId)
        REFERENCES Visits(VisitId)
);

-- =============================================
-- BLACKLISTED VISITORS TABLE
-- =============================================
CREATE TABLE BlacklistedVisitors (
    BlacklistId INT IDENTITY(1,1) PRIMARY KEY,

    VisitorId INT NOT NULL,

    Reason NVARCHAR(500),

    AddedBy INT NULL,

    AddedAt DATETIME DEFAULT GETDATE(),

    IsActive BIT DEFAULT 1,

    CONSTRAINT FK_BlacklistedVisitors_Visitors
        FOREIGN KEY (VisitorId)
        REFERENCES Visitors(VisitorId),

    CONSTRAINT FK_BlacklistedVisitors_Users
        FOREIGN KEY (AddedBy)
        REFERENCES Users(UserId)
);

-- =============================================
-- USER SESSIONS TABLE
-- =============================================
CREATE TABLE UserSessions (
    SessionId INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,

    Token NVARCHAR(MAX),

    LoginTime DATETIME DEFAULT GETDATE(),

    LogoutTime DATETIME NULL,

    IPAddress NVARCHAR(100),

    IsActive BIT DEFAULT 1,

    CONSTRAINT FK_UserSessions_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IX_Visitors_Mobile
ON Visitors(Mobile);

CREATE INDEX IX_Visitors_Email
ON Visitors(Email);

CREATE INDEX IX_Visits_VisitDate
ON Visits(VisitDate);

CREATE INDEX IX_Visits_Status
ON Visits(VisitStatusId);

CREATE INDEX IX_Visits_Department
ON Visits(DepartmentId);

CREATE INDEX IX_Visits_HostUser
ON Visits(HostUserId);

-- =============================================
-- DEFAULT MASTER DATA
-- =============================================

-- ROLES
INSERT INTO Roles (RoleName)
VALUES
('Admin'),
('Security'),
('Receptionist'),
('Faculty');

-- VISIT STATUS
INSERT INTO VisitStatus (StatusName)
VALUES
('Pending'),
('Approved'),
('Rejected'),
('CheckedIn'),
('CheckedOut'),
('Cancelled');

-- DEPARTMENTS
INSERT INTO Departments (DepartmentName, DepartmentCode)
VALUES
('Computer Science', 'CSE'),
('Information Technology', 'IT'),
('Administration', 'ADMIN'),
('Finance', 'FIN'),
('Human Resources', 'HR'),
('Security', 'SEC');

GO
```

--------------------------------------------------
-- ADMIN
--------------------------------------------------
INSERT INTO Users
(
    FullName,
    Email,
    Mobile,
    PasswordHash,
    RoleId,
    DepartmentId
)
VALUES
('System Administrator',
 'admin@university.edu',
 '9999000000',
 'HASH',
 1,
 NULL);

--------------------------------------------------
-- SECURITY GUARDS (5)
--------------------------------------------------
DECLARE @i INT = 1;

WHILE @i <= 5
BEGIN

    INSERT INTO Users
    (
        FullName,
        Email,
        Mobile,
        PasswordHash,
        RoleId,
        DepartmentId
    )
    VALUES
    (
        CONCAT('Security Guard ', @i),
        CONCAT('security', @i, '@university.edu'),
        CONCAT('9800000', FORMAT(@i,'000')),
        'HASH',
        2,
        6
    );

    SET @i = @i + 1;

END;

--------------------------------------------------
-- RECEPTIONISTS (5)
--------------------------------------------------
DECLARE @i INT = 1;

WHILE @i <= 5
BEGIN

    INSERT INTO Users
    (
        FullName,
        Email,
        Mobile,
        PasswordHash,
        RoleId,
        DepartmentId
    )
    VALUES
    (
        CONCAT('Receptionist ', @i),
        CONCAT('reception', @i, '@university.edu'),
        CONCAT('9810000', FORMAT(@i,'000')),
        'HASH',
        3,
        3
    );

    SET @i = @i + 1;

END;

--------------------------------------------------
-- FACULTY MEMBERS (50)
--------------------------------------------------
DECLARE @Faculty INT = 1;

WHILE @Faculty <= 50
BEGIN

    INSERT INTO Users
    (
        FullName,
        Email,
        Mobile,
        PasswordHash,
        RoleId,
        DepartmentId
    )
    VALUES
    (
        CONCAT('Dr. Faculty ', @Faculty),
        CONCAT('faculty', @Faculty, '@university.edu'),
        CONCAT('982', RIGHT('0000000' + CAST(@Faculty AS VARCHAR), 7)),
        'HASH',
        4,
        ((@Faculty - 1) % 5) + 1
    );

    SET @Faculty = @Faculty + 1;

END;

--------------------------------------------------
-- VERIFY
--------------------------------------------------
SELECT
    r.RoleName,
    COUNT(*) AS UserCount
FROM Users u
INNER JOIN Roles r
    ON u.RoleId = r.RoleId
GROUP BY r.RoleName;

-- ==========================================
-- STEP 2: VISITORS (100 TOTAL)
-- ==========================================

DECLARE @Visitor INT = 1;

WHILE @Visitor <= 100
BEGIN

INSERT INTO Visitors
(
    FullName,
    Mobile,
    Email,
    Gender,
    Address,
    IDProofType,
    IDProofNumber
)
VALUES
(
    CONCAT('Visitor ', @Visitor),
    CONCAT('98',RIGHT('00000000'+CAST(@Visitor AS VARCHAR),8)),
    CONCAT('visitor',@Visitor,'@gmail.com'),
    CASE
        WHEN @Visitor % 2 = 0 THEN 'Male'
        ELSE 'Female'
    END,
    CONCAT('Address ', @Visitor),
    'Aadhaar',
    CONCAT('AAD',100000 + @Visitor)
);

SET @Visitor += 1;

END;

-- ==========================================
-- STEP 3: 500 HISTORICAL VISITS
-- ==========================================

DECLARE @Counter INT = 1;

WHILE @Counter <= 500
BEGIN

DECLARE @VisitorId INT =
(ABS(CHECKSUM(NEWID())) % 100) + 1;

DECLARE @HostUserId INT =
(ABS(CHECKSUM(NEWID())) % 50) + 12;

DECLARE @DepartmentId INT =
(ABS(CHECKSUM(NEWID())) % 6) + 1;

DECLARE @VisitDate DATE =
DATEADD
(
    DAY,
    -(ABS(CHECKSUM(NEWID())) % 150),
    CAST(GETDATE() AS DATE)
);

DECLARE @ApprovalStatus NVARCHAR(20);

SET @ApprovalStatus =
CASE
    WHEN @Counter % 10 = 0 THEN 'Rejected'
    WHEN @Counter % 4 = 0 THEN 'Pending'
    ELSE 'Approved'
END;

DECLARE @StatusId INT;

SET @StatusId =
CASE
    WHEN @ApprovalStatus='Rejected' THEN 3
    ELSE 5
END;

INSERT INTO Visits
(
    VisitorId,
    HostUserId,
    DepartmentId,
    Purpose,
    VisitDate,
    CheckInTime,
    CheckOutTime,
    VisitStatusId,
    GatePassNumber,
    ApprovalStatus,
    CreatedAt
)
VALUES
(
    @VisitorId,
    @HostUserId,
    @DepartmentId,
    CONCAT('Meeting Purpose ', @Counter),
    @VisitDate,
    DATEADD(HOUR,9,CAST(@VisitDate AS DATETIME)),
    DATEADD(HOUR,12,CAST(@VisitDate AS DATETIME)),
    @StatusId,
    CONCAT('GP-',FORMAT(@Counter,'00000')),
    @ApprovalStatus,
    GETDATE()
);

SET @Counter += 1;

END;

-- ==========================================
-- STEP 4: 20 ACTIVE VISITORS
-- ==========================================

DECLARE @Active INT = 1;

WHILE @Active <= 20
BEGIN

INSERT INTO Visits
(
    VisitorId,
    HostUserId,
    DepartmentId,
    Purpose,
    VisitDate,
    CheckInTime,
    VisitStatusId,
    GatePassNumber,
    ApprovalStatus
)
VALUES
(
    @Active,
    ((@Active-1)%50)+12,
    ((@Active-1)%6)+1,
    'Currently Inside Campus',
    CAST(GETDATE() AS DATE),
    DATEADD(MINUTE,-(@Active*10),GETDATE()),
    4,
    CONCAT('LIVE-',@Active),
    'Approved'
);

SET @Active += 1;

END;

-- ==========================================
-- STEP 5: APPROVAL RECORDS
-- ==========================================

INSERT INTO Approvals
(
VisitId,
ApproverUserId,
Status,
Remarks
)
SELECT
VisitId,
HostUserId,
ApprovalStatus,
'System Generated Approval'
FROM Visits
WHERE ApprovalStatus IN ('Approved','Rejected');

-- ==========================================
-- STEP 6: GATE PASSES
-- ==========================================

INSERT INTO GatePasses
(
VisitId,
PassNumber,
GeneratedAt
)
SELECT
VisitId,
GatePassNumber,
CreatedAt
FROM Visits
WHERE GatePassNumber IS NOT NULL;

-- ==========================================
-- STEP 7: SAMPLE NOTIFICATIONS
-- ==========================================

INSERT INTO Notifications
(
UserId,
Title,
Message
)
SELECT TOP 50
UserId,
'Visitor Notification',
'A visitor request has been assigned.'
FROM Users
ORDER BY NEWID();

-- ==========================================
-- STEP 8: FACE RECOGNITION LOGS
-- ==========================================

INSERT INTO FaceRecognitionLogs
(
VisitorId,
VisitId,
ConfidenceScore,
RecognitionStatus,
CameraLocation
)
SELECT TOP 100
VisitorId,
VisitId,
95.50,
'Matched',
'Main Gate'
FROM Visits
ORDER BY NEWID();

 select * from FaceRecognitionLogs