USE LMPlatform

ALTER TABLE Attachments
ADD UserId INT NULL
GO
ALTER TABLE Attachments
ADD FOREIGN KEY (UserId) REFERENCES Users(UserId)