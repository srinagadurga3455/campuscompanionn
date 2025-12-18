// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StudentId
 * @dev Smart contract for minting and managing blockchain-based student IDs
 * Format: YYCCAAxxxx (Year-College-Department-Sequential)
 */
contract StudentId is Ownable {
    struct Student {
        string userId;           // MongoDB user ID
        string blockchainId;     // YYCCAAxxxx format
        string name;
        string email;
        uint256 mintedAt;
        bool isActive;
    }

    // Mapping from blockchainId to Student
    mapping(string => Student) public students;
    
    // Mapping to track if a blockchainId exists
    mapping(string => bool) public blockchainIdExists;
    
    // Array of all student IDs for enumeration
    string[] public allStudentIds;

    event StudentIdMinted(
        string indexed blockchainId,
        string userId,
        string name,
        uint256 timestamp
    );

    event StudentDeactivated(string indexed blockchainId, uint256 timestamp);
    event StudentReactivated(string indexed blockchainId, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Mint a new student ID on blockchain
     * @param _userId MongoDB user ID
     * @param _blockchainId Student ID in YYCCAAxxxx format
     * @param _name Student name
     * @param _email Student email
     */
    function mintStudentId(
        string memory _userId,
        string memory _blockchainId,
        string memory _name,
        string memory _email
    ) public onlyOwner {
        require(!blockchainIdExists[_blockchainId], "Student ID already exists");
        require(bytes(_userId).length > 0, "User ID required");
        require(bytes(_blockchainId).length == 10, "Invalid blockchain ID format");

        Student memory newStudent = Student({
            userId: _userId,
            blockchainId: _blockchainId,
            name: _name,
            email: _email,
            mintedAt: block.timestamp,
            isActive: true
        });

        students[_blockchainId] = newStudent;
        blockchainIdExists[_blockchainId] = true;
        allStudentIds.push(_blockchainId);

        emit StudentIdMinted(_blockchainId, _userId, _name, block.timestamp);
    }

    /**
     * @dev Get student details by blockchain ID
     * @param _blockchainId Student blockchain ID
     */
    function getStudent(string memory _blockchainId) 
        public 
        view 
        returns (Student memory) 
    {
        require(blockchainIdExists[_blockchainId], "Student ID does not exist");
        return students[_blockchainId];
    }

    /**
     * @dev Verify if a student ID is valid and active
     * @param _blockchainId Student blockchain ID
     */
    function verifyStudentId(string memory _blockchainId) 
        public 
        view 
        returns (bool) 
    {
        if (!blockchainIdExists[_blockchainId]) {
            return false;
        }
        return students[_blockchainId].isActive;
    }

    /**
     * @dev Deactivate a student ID
     * @param _blockchainId Student blockchain ID
     */
    function deactivateStudent(string memory _blockchainId) public onlyOwner {
        require(blockchainIdExists[_blockchainId], "Student ID does not exist");
        require(students[_blockchainId].isActive, "Student already deactivated");
        
        students[_blockchainId].isActive = false;
        emit StudentDeactivated(_blockchainId, block.timestamp);
    }

    /**
     * @dev Reactivate a student ID
     * @param _blockchainId Student blockchain ID
     */
    function reactivateStudent(string memory _blockchainId) public onlyOwner {
        require(blockchainIdExists[_blockchainId], "Student ID does not exist");
        require(!students[_blockchainId].isActive, "Student already active");
        
        students[_blockchainId].isActive = true;
        emit StudentReactivated(_blockchainId, block.timestamp);
    }

    /**
     * @dev Get total number of minted student IDs
     */
    function getTotalStudents() public view returns (uint256) {
        return allStudentIds.length;
    }

    /**
     * @dev Get student ID by index
     * @param index Index in the array
     */
    function getStudentIdByIndex(uint256 index) public view returns (string memory) {
        require(index < allStudentIds.length, "Index out of bounds");
        return allStudentIds[index];
    }
}
