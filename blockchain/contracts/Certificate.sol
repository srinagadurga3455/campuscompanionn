// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Certificate
 * @dev NFT-based certificate issuance system for campus events and achievements
 */
contract Certificate is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct CertificateData {
        string recipient;          // Student blockchain ID
        string title;
        string description;
        string certificateType;    // participation, achievement, completion, award
        uint256 issuedAt;
        bool isValid;
    }

    // Mapping from token ID to certificate data
    mapping(uint256 => CertificateData) public certificates;

    // Mapping from student ID to their certificates
    mapping(string => uint256[]) public studentCertificates;

    event CertificateIssued(
        uint256 indexed tokenId,
        string recipient,
        string title,
        string certificateType,
        uint256 timestamp
    );

    event CertificateRevoked(uint256 indexed tokenId, uint256 timestamp);

    constructor() ERC721("CampusCertificate", "CCERT") Ownable(msg.sender) {}

    /**
     * @dev Issue a new certificate
     * @param _recipient Student blockchain ID
     * @param _title Certificate title
     * @param _description Certificate description
     * @param _certificateType Type of certificate
     */
    function issueCertificate(
        string memory _recipient,
        string memory _title,
        string memory _description,
        string memory _certificateType
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Mint NFT to contract owner (college)
        _safeMint(owner(), tokenId);

        // Store certificate data
        CertificateData memory cert = CertificateData({
            recipient: _recipient,
            title: _title,
            description: _description,
            certificateType: _certificateType,
            issuedAt: block.timestamp,
            isValid: true
        });

        certificates[tokenId] = cert;
        studentCertificates[_recipient].push(tokenId);

        emit CertificateIssued(tokenId, _recipient, _title, _certificateType, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get certificate details
     * @param tokenId Certificate token ID
     */
    function getCertificate(uint256 tokenId) 
        public 
        view 
        returns (CertificateData memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificates[tokenId];
    }

    /**
     * @dev Get all certificates for a student
     * @param studentId Student blockchain ID
     */
    function getStudentCertificates(string memory studentId) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return studentCertificates[studentId];
    }

    /**
     * @dev Verify certificate authenticity
     * @param tokenId Certificate token ID
     */
    function verifyCertificate(uint256 tokenId) 
        public 
        view 
        returns (bool) 
    {
        if (_ownerOf(tokenId) == address(0)) {
            return false;
        }
        return certificates[tokenId].isValid;
    }

    /**
     * @dev Revoke a certificate
     * @param tokenId Certificate token ID
     */
    function revokeCertificate(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        require(certificates[tokenId].isValid, "Certificate already revoked");
        
        certificates[tokenId].isValid = false;
        emit CertificateRevoked(tokenId, block.timestamp);
    }

    /**
     * @dev Get total certificates issued
     */
    function getTotalCertificates() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
