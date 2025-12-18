// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Badge
 * @dev NFT-based badge system for campus achievements and skills
 */
contract Badge is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct BadgeData {
        string recipient;       // Student blockchain ID
        string name;
        string badgeType;       // skill, achievement, milestone, leadership, participation
        string imageUrl;
        uint256 issuedAt;
    }

    // Mapping from token ID to badge data
    mapping(uint256 => BadgeData) public badges;

    // Mapping from student ID to their badges
    mapping(string => uint256[]) public studentBadges;

    // Mapping to track badge types count for students
    mapping(string => mapping(string => uint256)) public studentBadgeTypeCount;

    event BadgeIssued(
        uint256 indexed tokenId,
        string recipient,
        string name,
        string badgeType,
        uint256 timestamp
    );

    constructor() ERC721("CampusBadge", "CBADGE") Ownable(msg.sender) {}

    /**
     * @dev Issue a new badge
     * @param _recipient Student blockchain ID
     * @param _name Badge name
     * @param _badgeType Type of badge
     * @param _imageUrl Badge image URL
     */
    function issueBadge(
        string memory _recipient,
        string memory _name,
        string memory _badgeType,
        string memory _imageUrl
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Mint NFT to contract owner (college)
        _safeMint(owner(), tokenId);

        // Store badge data
        BadgeData memory badge = BadgeData({
            recipient: _recipient,
            name: _name,
            badgeType: _badgeType,
            imageUrl: _imageUrl,
            issuedAt: block.timestamp
        });

        badges[tokenId] = badge;
        studentBadges[_recipient].push(tokenId);
        studentBadgeTypeCount[_recipient][_badgeType]++;

        emit BadgeIssued(tokenId, _recipient, _name, _badgeType, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get badge details
     * @param tokenId Badge token ID
     */
    function getBadge(uint256 tokenId) 
        public 
        view 
        returns (BadgeData memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badges[tokenId];
    }

    /**
     * @dev Get all badges for a student
     * @param studentId Student blockchain ID
     */
    function getStudentBadges(string memory studentId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return studentBadges[studentId];
    }

    /**
     * @dev Get count of specific badge type for a student
     * @param studentId Student blockchain ID
     * @param badgeType Type of badge
     */
    function getStudentBadgeTypeCount(string memory studentId, string memory badgeType) 
        public 
        view 
        returns (uint256) 
    {
        return studentBadgeTypeCount[studentId][badgeType];
    }

    /**
     * @dev Get total badges issued
     */
    function getTotalBadges() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if student has a specific badge type
     * @param studentId Student blockchain ID
     * @param badgeType Type of badge
     */
    function hasBadgeType(string memory studentId, string memory badgeType) 
        public 
        view 
        returns (bool) 
    {
        return studentBadgeTypeCount[studentId][badgeType] > 0;
    }
}
