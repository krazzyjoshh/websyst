<?php

namespace App\Services;

class ProductApprovalService
{
    /**
     * Flagged keywords that products shouldn't contain
     */
    protected $flaggedKeywords = [
        // Weapons
        'gun', 'firearm', 'weapon', 'explosive', 'ammunition', 'bomb',
        // Drugs
        'cocaine', 'heroin', 'methamphetamine', 'meth', 'fentanyl',
        // Counterfeit
        'fake', 'counterfeit', 'replica', 'knockoff',
        // Stolen goods
        'stolen', 'black market',
        // Prohibited substances
        'marijuana', 'cannabis', 'weed',
        // Add more as needed
    ];

    /**
     * Check if product contains flagged keywords
     * Returns array of found keywords or empty array
     */
    public function checkForFlaggedKeywords($productName, $productDescription = ''): array
    {
        $text = strtolower($productName . ' ' . $productDescription);
        $flaggedFound = [];

        foreach ($this->flaggedKeywords as $keyword) {
            if (strpos($text, strtolower($keyword)) !== false) {
                $flaggedFound[] = $keyword;
            }
        }

        return $flaggedFound;
    }

    /**
     * Check if product should be automatically approved
     * (no flagged keywords, from verified sellers)
     */
    public function shouldAutoApprove($product, $seller): bool
    {
        // Only auto-approve if no flagged keywords
        if (!empty($this->checkForFlaggedKeywords($product->name, $product->description))) {
            return false;
        }

        // Optional: Auto-approve for verified sellers
        if ($seller->sellerProfile && $seller->sellerProfile->is_verified) {
            return true;
        }

        return false;
    }

    /**
     * Add custom flagged keyword
     */
    public function addFlaggedKeyword($keyword): void
    {
        if (!in_array(strtolower($keyword), $this->flaggedKeywords)) {
            $this->flaggedKeywords[] = strtolower($keyword);
        }
    }

    /**
     * Get all flagged keywords
     */
    public function getFlaggedKeywords(): array
    {
        return $this->flaggedKeywords;
    }
}
