// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title CopyrightRegistry
 * @dev Decentralized copyright registration system for artists
 */
contract CopyrightRegistry {
    struct Copyright {
        uint256 id;
        address artist;
        string title;
        string description;
        string fileHash; // SHA256 hash of the file
        string ipfsHash; // IPFS CID
        string licenseType;
        uint256 timestamp;
        bool exists;
    }

    uint256 private copyrightCounter = 1;

    // copyrightId => Copyright
    mapping(uint256 => Copyright) public copyrights;

    // fileHash => copyrightId (for duplicate detection)
    mapping(string => uint256) public fileHashToCopyright;

    // artist address => array of copyrightIds
    mapping(address => uint256[]) public artistCopyrights;

    event CopyrightRegistered(
        uint256 indexed copyrightId,
        address indexed artist,
        string title,
        string fileHash,
        uint256 timestamp
    );

    event CopyrightMetadataUpdated(
        uint256 indexed copyrightId,
        string newTitle,
        string newDescription
    );

    /**
     * @dev Register a new copyright
     * @param _title Title of the work
     * @param _description Description of the work
     * @param _fileHash SHA256 hash of the file
     * @param _ipfsHash IPFS CID of the file
     * @param _licenseType License type (e.g., "CC-BY-NC", "Exclusive")
     */
    function registerCopyright(
        string memory _title,
        string memory _description,
        string memory _fileHash,
        string memory _ipfsHash,
        string memory _licenseType
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_fileHash).length > 0, "File hash required");
        require(fileHashToCopyright[_fileHash] == 0, "File already registered");

        uint256 copyrightId = copyrightCounter++;

        Copyright storage newCopyright = copyrights[copyrightId];
        newCopyright.id = copyrightId;
        newCopyright.artist = msg.sender;
        newCopyright.title = _title;
        newCopyright.description = _description;
        newCopyright.fileHash = _fileHash;
        newCopyright.ipfsHash = _ipfsHash;
        newCopyright.licenseType = _licenseType;
        newCopyright.timestamp = block.timestamp;
        newCopyright.exists = true;

        // Map file hash to copyright ID for verification
        fileHashToCopyright[_fileHash] = copyrightId;

        // Add to artist's copyrights
        artistCopyrights[msg.sender].push(copyrightId);

        emit CopyrightRegistered(
            copyrightId,
            msg.sender,
            _title,
            _fileHash,
            block.timestamp
        );

        return copyrightId;
    }

    /**
     * @dev Get copyright details by ID
     */
    function getCopyright(uint256 _copyrightId)
        public
        view
        returns (Copyright memory)
    {
        require(copyrights[_copyrightId].exists, "Copyright not found");
        return copyrights[_copyrightId];
    }

    /**
     * @dev Get all copyrights for an artist
     */
    function getArtistCopyrights(address _artist)
        public
        view
        returns (uint256[] memory)
    {
        return artistCopyrights[_artist];
    }

    /**
     * @dev Get copyright count for an artist
     */
    function getArtistCopyrightCount(address _artist)
        public
        view
        returns (uint256)
    {
        return artistCopyrights[_artist].length;
    }

    /**
     * @dev Verify if a file hash is already registered
     * @return copyrightId The copyright ID (0 if not registered)
     */
    function verifyCopyright(string memory _fileHash)
        public
        view
        returns (uint256)
    {
        return fileHashToCopyright[_fileHash];
    }

    /**
     * @dev Update copyright metadata (title/description)
     * @dev Only the copyright owner can update
     */
    function updateCopyrightMetadata(
        uint256 _copyrightId,
        string memory _newTitle,
        string memory _newDescription
    ) public {
        require(copyrights[_copyrightId].exists, "Copyright not found");
        require(
            copyrights[_copyrightId].artist == msg.sender,
            "Only copyright owner can update"
        );

        copyrights[_copyrightId].title = _newTitle;
        copyrights[_copyrightId].description = _newDescription;

        emit CopyrightMetadataUpdated(_copyrightId, _newTitle, _newDescription);
    }

    /**
     * @dev Get total number of copyrights registered
     */
    function getTotalCopyrights() public view returns (uint256) {
        return copyrightCounter - 1;
    }
}
