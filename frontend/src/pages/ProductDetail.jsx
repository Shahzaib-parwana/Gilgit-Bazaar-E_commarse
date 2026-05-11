// ProductDetail.jsx (Updated - Fixed review images display)
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Check, Star, Truck, ShieldCheck, RotateCcw, Package, MessageCircle, ThumbsUp, Camera, X } from 'lucide-react';
import { productService } from '../services/productService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import wishlistService from '../services/wishlistService';
import reviewService from '../services/reviewService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

// Keep your original productDetailStyles exactly as they were
const productDetailStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .product-detail-wrap {
    background: var(--midnight);
    min-height: 100vh;
    padding: 100px 0 80px;
    font-family: 'DM Sans', sans-serif;
  }

  :root {
    --midnight: #0a0f1e;
    --navy: #0d1635;
    --navy-2: #131c42;
    --gold: #f0a500;
    --gold-light: #fbbf24;
    --gold-dim: rgba(240,165,0,0.12);
    --slate: #1e2a4a;
    --muted: #8892aa;
    --white: #ffffff;
  }

  .detail-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .breadcrumb {
    margin-bottom: 32px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    animation: fadeUp 0.5s ease forwards;
  }

  .breadcrumb a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .breadcrumb a:hover { color: var(--gold); }
  .breadcrumb span { color: var(--muted); }
  .breadcrumb .current { color: #fff; }

  .product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    animation: fadeUp 0.6s ease forwards;
  }

  /* Gallery Styles */
  .gallery-main {
    position: relative;
    aspect-ratio: 1/1;
    background: var(--navy-2);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .gallery-main:hover img { transform: scale(1.02); }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
    z-index: 2;
  }

  .nav-btn.prev { left: 12px; }
  .nav-btn.next { right: 12px; }
  .nav-btn:hover { background: rgba(0,0,0,0.8); }

  .thumbnails {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .thumb {
    width: 80px;
    aspect-ratio: 1/1;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;
    background: var(--navy-2);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb.active {
    border-color: var(--gold);
  }

  .discount-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff;
    padding: 6px 14px;
    border-radius: 40px;
    font-weight: 700;
    font-size: 0.8rem;
    z-index: 2;
  }

  .product-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stars {
    display: flex;
    gap: 2px;
    color: var(--gold);
  }

  .rating-text {
    font-size: 0.8rem;
    color: var(--muted);
  }

  .price {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
  }

  .current-price {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--gold);
  }

  .old-price {
    font-size: 1.2rem;
    color: var(--muted);
    text-decoration: line-through;
  }

  .stock-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    padding: 12px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .in-stock { color: #22c55e; font-weight: 600; }
  .out-stock { color: #ef4444; font-weight: 600; }

  /* Variant Styles */
  .variant-section {
    margin-bottom: 24px;
  }

  .variant-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
  }

  .variant-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .variant-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    padding: 8px 20px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }

  .variant-btn:hover {
    border-color: var(--gold);
    color: var(--gold);
  }

  .variant-btn.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #000;
  }

  /* Quantity Section */
  .quantity-section {
    margin-bottom: 28px;
  }

  .quantity-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
  }

  .quantity-selector {
    display: inline-flex;
    align-items: center;
    background: rgba(255,255,255,0.05);
    border-radius: 40px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .qty-btn {
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s;
    border-radius: 40px;
  }

  .qty-btn:hover { background: var(--gold-dim); color: var(--gold); }

  .qty-value {
    min-width: 50px;
    text-align: center;
    font-weight: 600;
    font-size: 1.1rem;
    color: #fff;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }

  .btn-cart {
    flex: 1;
    background: var(--gold);
    border: none;
    border-radius: 40px;
    padding: 14px 24px;
    font-weight: 700;
    font-size: 0.95rem;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.25s;
  }

  .btn-cart:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(240,165,0,0.3); }
  .btn-cart:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }

  .btn-wishlist {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    width: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--muted);
  }

  .btn-wishlist:hover { 
    border-color: var(--gold); 
    color: var(--gold);
    transform: scale(1.05);
  }

  .btn-wishlist.wishlisted {
    background: rgba(239,68,68,0.15);
    border-color: #ef4444;
    color: #ef4444;
  }

  .btn-wishlist.wishlisted:hover {
    background: rgba(239,68,68,0.25);
    transform: scale(1.05);
  }

  .btn-wishlist:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Trust Badges */
  .trust-badges {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 32px;
    padding: 20px;
    background: var(--navy-2);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .trust-item svg { color: var(--gold); }

  /* Details Card */
  .details-card {
    margin-top: 48px;
    background: var(--navy-2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 32px;
  }

  .details-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 20px;
  }

  .details-description {
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    margin-bottom: 24px;
  }

  .specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .spec-item {
    display: flex;
    gap: 8px;
  }

  .spec-label {
    color: var(--muted);
    font-size: 0.85rem;
  }

  .spec-value {
    color: #fff;
    font-weight: 500;
  }

  /* Bundle specific */
  .bundle-items-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 28px 0 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bundle-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .bundle-item-card {
    background: var(--navy-2);
    border-radius: 20px;
    padding: 12px;
    text-align: center;
    transition: transform 0.2s;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .bundle-item-card:hover { transform: translateY(-4px); background: #1a2552; }

  .bundle-item-img {
    aspect-ratio: 1/1;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .bundle-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bundle-item-name {
    font-weight: 600;
    color: #fff;
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .bundle-item-qty {
    font-size: 0.8rem;
    color: var(--gold);
    font-weight: 500;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner-small {
    animation: spin 0.8s linear infinite;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .product-grid { grid-template-columns: 1fr; gap: 32px; }
    .detail-container { padding: 0 20px; }
    .product-title { font-size: 1.8rem; }
    .trust-badges { flex-wrap: wrap; justify-content: center; }
  }
`;

// Additional styles for review section (appended to existing styles)
const reviewSectionStyles = `
  /* Review Section Styles */
  .reviews-section {
    margin-top: 60px;
    background: var(--navy);
    border-radius: 24px;
    padding: 32px;
    border: 1px solid rgba(255,255,255,0.08);
    animation: fadeUp 0.5s ease forwards;
  }

  .reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .reviews-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .write-review-btn {
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    border: none;
    border-radius: 40px;
    padding: 12px 24px;
    font-weight: 600;
    color: #000;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .write-review-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(240,165,0,0.3);
  }

  .write-review-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Stats Section */
  .review-stats {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 40px;
    padding: 24px;
    background: rgba(255,255,255,0.03);
    border-radius: 20px;
    margin-bottom: 32px;
  }

  .stats-summary {
    text-align: center;
    min-width: 200px;
  }

  .average-rating {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--gold);
  }

  .total-reviews {
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 8px;
  }

  .rating-distribution {
    flex: 1;
  }

  .distribution-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .distribution-label {
    min-width: 50px;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .distribution-bar-container {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }

  .distribution-bar {
    height: 100%;
    background: var(--gold);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .distribution-count {
    min-width: 40px;
    color: var(--muted);
    font-size: 0.8rem;
    text-align: right;
  }

  /* Review Filters */
  .review-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .filter-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 6px 16px;
    border-radius: 40px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
  }

  .filter-btn.active {
    background: var(--gold);
    color: #000;
    border-color: var(--gold);
  }

  .filter-btn:hover:not(.active) {
    border-color: var(--gold);
    color: var(--gold);
  }

  .sort-select {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    padding: 6px 16px;
    color: #fff;
    cursor: pointer;
    font-size: 0.85rem;
  }

  /* Review Card */
  .review-card {
    background: rgba(255,255,255,0.03);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .review-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(240,165,0,0.2);
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .reviewer-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    color: #000;
    overflow: hidden;
    flex-shrink: 0;
  }

  .reviewer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .reviewer-details {
    flex: 1;
  }

  .reviewer-name {
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .review-date {
    font-size: 0.7rem;
    color: var(--muted);
  }

  .review-rating {
    display: flex;
    gap: 4px;
  }

  .review-title-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    margin: 12px 0 8px;
  }

  .review-comment {
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  /* Review Images Grid */
  .review-images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
    max-width: 400px;
    margin: 16px 0;
  }

  .review-image-item {
    position: relative;
    aspect-ratio: 1/1;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    transition: transform 0.2s;
  }

  .review-image-item:hover {
    transform: scale(1.05);
    border-color: var(--gold);
  }

  .review-image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Helpful Button */
  .helpful-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    padding: 6px 16px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
  }

  .helpful-btn:hover {
    background: rgba(240,165,0,0.15);
    border-color: var(--gold);
    color: var(--gold);
  }

  .helpful-btn.active {
    background: rgba(240,165,0,0.2);
    border-color: var(--gold);
    color: var(--gold);
  }

  /* Pagination */
  .reviews-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .page-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    padding: 8px 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 40px;
  }

  .page-btn:hover:not(:disabled) {
    background: rgba(240,165,0,0.15);
    border-color: var(--gold);
    color: var(--gold);
  }

  .page-btn.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #000;
  }

  .page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* No Reviews */
  .no-reviews {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }

  .no-reviews-icon {
    width: 80px;
    height: 80px;
    background: var(--navy-2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .no-reviews-icon svg {
    color: var(--gold);
  }

  /* Image Modal */
  .image-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.95);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .image-modal img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
  }

  /* Review Modal */
  .review-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .review-modal {
    background: var(--navy-2);
    border-radius: 24px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid rgba(255,255,255,0.1);
    animation: fadeUp 0.3s ease;
  }
  .review-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .review-modal-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: #fff;
  }
  .close-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
  }
  .close-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
  .review-modal-body {
    padding: 24px;
  }
  .rating-section {
    margin-bottom: 24px;
    text-align: center;
  }
  .rating-label {
    color: #fff;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .rating-stars {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .rating-star {
    cursor: pointer;
    transition: transform 0.2s;
  }
  .rating-star:hover {
    transform: scale(1.1);
  }
  .form-group {
    margin-bottom: 20px;
  }
  .form-group label {
    display: block;
    color: #fff;
    margin-bottom: 8px;
    font-weight: 500;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: #fff;
    font-family: inherit;
  }
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--gold);
  }
  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }
  .image-upload-section {
    margin-bottom: 20px;
  }
  .image-upload-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px dashed rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 10px 16px;
    cursor: pointer;
    color: var(--muted);
  }
  .image-upload-label:hover {
    border-color: var(--gold);
    color: var(--gold);
  }
  .image-preview-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .image-preview {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .remove-image-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0,0,0,0.6);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
  }
  .remove-image-btn:hover {
    background: #ef4444;
  }
  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  .btn-cancel {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 40px;
    padding: 10px 24px;
    color: #fff;
    cursor: pointer;
  }
  .btn-cancel:hover {
    background: rgba(255,255,255,0.1);
  }
  .btn-submit {
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    border: none;
    border-radius: 40px;
    padding: 10px 28px;
    font-weight: 600;
    color: #000;
    cursor: pointer;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(240,165,0,0.3);
  }
  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .reviews-section {
      padding: 20px;
    }
    .review-stats {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .review-filters {
      flex-direction: column;
      align-items: stretch;
    }
    .filter-buttons {
      justify-content: center;
    }
  }
`;

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  
  // Review form states
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
      checkCanReview();
    }
  }, [user, product]);

  useEffect(() => {
    if (product) {
      fetchReviews();
      fetchReviewStats();
    }
  }, [product, filterRating, sortBy, currentPage]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProduct(slug);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!product) return;
    setReviewsLoading(true);
    try {
      const data = await reviewService.getProductReviews(product.id, {
        page: currentPage,
        pageSize: 10,
        rating: filterRating,
        ordering: sortBy
      });
      setReviews(data.results || []);
      setTotalPages(Math.ceil(data.count / 10) || 1);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    if (!product) return;
    try {
      const data = await reviewService.getReviewStats(product.id);
      setReviewStats(data);
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    }
  };

  const checkCanReview = async () => {
    try {
      const data = await reviewService.canReviewProduct(product.id);
      setCanReview(data.can_review);
    } catch (error) {
      console.error('Failed to check review eligibility:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const wishlistData = await wishlistService.getWishlist();
      const existingItem = wishlistData.items.find(item => item.product === product.id);
      if (existingItem) {
        setIsInWishlist(true);
        setWishlistItemId(existingItem.id);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(wishlistItemId);
        setIsInWishlist(false);
        setWishlistItemId(null);
        toast.success('Removed from wishlist');
      } else {
        const response = await wishlistService.addToWishlist(product.id, selectedVariant?.id || null);
        setIsInWishlist(true);
        setWishlistItemId(response.item?.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.is_bundle) {
      if (product.available_bundles <= 0) {
        toast.error('Hamper is out of stock');
        return;
      }
      addToCart(product.id, quantity);
    } else {
      if (!product.in_stock) {
        toast.error('Product is out of stock');
        return;
      }
      addToCart(product.id, quantity, selectedVariant?.id);
    }
  };

  const handleImageNav = (direction) => {
    if (!product.images) return;
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleHelpfulClick = async (reviewId) => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }
    try {
      const response = await reviewService.toggleHelpful(reviewId);
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful_count: response.helpful_count, is_helpful_by_user: response.is_helpful }
          : review
      ));
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (reviewImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);
    try {
      const response = await reviewService.uploadReviewImages(files);
      setReviewImages(prev => [...prev, ...response.urls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        product: product.id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        images: reviewImages
      });
      toast.success('Review submitted! It will appear after moderation.');
      setShowReviewModal(false);
      resetReviewForm();
      fetchReviews();
      fetchReviewStats();
      setCanReview(false);
    } catch (error) {
      const message = error.response?.data?.rating?.[0] || 
                     error.response?.data?.detail || 
                     'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const resetReviewForm = () => {
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    setReviewImages([]);
    setHoverRating(0);
  };

  const handleRatingClick = (rating) => {
    setFilterRating(filterRating === rating ? null : rating);
    setCurrentPage(1);
  };

  const renderStars = (rating, size = 16) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? '#f0a500' : 'none'}
        stroke="#f0a500"
      />
    ));
  };

  const renderRatingDistribution = () => {
    if (!reviewStats) return null;
    
    return (
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map(rating => (
          <div 
            key={rating} 
            className="distribution-row"
            onClick={() => handleRatingClick(rating)}
            style={{ cursor: 'pointer' }}
          >
            <div className="distribution-label">{rating} ★</div>
            <div className="distribution-bar-container">
              <div 
                className="distribution-bar" 
                style={{ width: `${reviewStats.rating_percentages[rating]}%` }}
              />
            </div>
            <div className="distribution-count">{reviewStats.rating_distribution[rating]}</div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render reviewer avatar with image support
  const renderReviewerAvatar = (review) => {
    if (review.user_avatar) {
      return (
        <img 
          src={review.user_avatar} 
          alt={review.user_name || 'User'}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.textContent = (review.user_name?.[0] || review.user_email?.[0] || 'U').toUpperCase();
          }}
        />
      );
    }
    return (review.user_name?.[0] || review.user_email?.[0] || 'U').toUpperCase();
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-12 text-white">Product not found</div>;

  // GIFT HAMPER (BUNDLE) VIEW
  if (product.is_bundle) {
    return (
      <div className="product-detail-wrap">
        <style>{productDetailStyles}</style>
        <style>{reviewSectionStyles}</style>
        <div className="detail-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/gift-hampers">Gift Hampers</Link>
            <span>/</span>
            <span className="current">{product.name}</span>
          </div>

          <div className="product-grid">
            {/* Left: Image */}
            <div>
              <div className="gallery-main">
                <img
                  src={product.images?.[0]?.image || 'https://via.placeholder.com/600x600?text=Hamper+Image'}
                  alt={product.name}
                />
                {product.discount_percentage > 0 && (
                  <div className="discount-badge">-{product.discount_percentage}% OFF</div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="product-title">🎁 {product.name}</h1>
              <div className="price">
                <span className="current-price">PKR {parseFloat(product.price).toFixed(2)}</span>
                {product.compare_price && (
                  <span className="old-price">PKR {parseFloat(product.compare_price).toFixed(2)}</span>
                )}
              </div>
              <div className="stock-status">
                {product.available_bundles > 0 ? (
                  <>
                    <Check size={18} style={{ color: '#22c55e' }} />
                    <span className="in-stock">In Stock ({product.available_bundles} hampers available)</span>
                  </>
                ) : (
                  <span className="out-stock">Out of Stock</span>
                )}
              </div>

              {/* Bundle Items List */}
              <div className="bundle-items-title">
                <Package size={22} /> Items in this Hamper
              </div>
              <div className="bundle-items-grid">
                {product.bundle_items?.map(item => (
                  <div key={item.id} className="bundle-item-card">
                    <div className="bundle-item-img">
                      <img
                        src={item.product_primary_image || 'https://via.placeholder.com/150'}
                        alt={item.product_name}
                      />
                    </div>
                    <div className="bundle-item-name">{item.product_name}</div>
                    <div className="bundle-item-qty">Quantity: {item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="quantity-section">
                <div className="quantity-label">Quantity</div>
                <div className="quantity-selector">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(product.available_bundles || 0, quantity + 1))}
                  >+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="action-buttons">
                <button
                  className="btn-cart"
                  onClick={handleAddToCart}
                  disabled={!product.available_bundles || product.available_bundles <= 0}
                >
                  <ShoppingCart size={18} /> Add Full Hamper
                </button>
                <button 
                  className={`btn-wishlist ${isInWishlist ? 'wishlisted' : ''}`}
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <svg className="spinner-small" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                  )}
                </button>
              </div>

              {/* Trust badges */}
              <div className="trust-badges">
                <div className="trust-item"><Truck size={16} /> Free Shipping</div>
                <div className="trust-item"><ShieldCheck size={16} /> Secure Payment</div>
                <div className="trust-item"><RotateCcw size={16} /> 30-Day Returns</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="details-card">
            <div className="details-title">Hamper Details</div>
            <div className="details-description">{product.description}</div>
          </div>

          {/* Reviews Section for Bundle */}
          <div className="reviews-section">
            <div className="reviews-header">
              <div className="reviews-title">
                <MessageCircle size={24} />
                Customer Reviews
              </div>
              {user && canReview && (
                <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
                  <Star size={18} /> Write a Review
                </button>
              )}
            </div>

            {reviewStats && reviewStats.total_reviews > 0 && (
              <div className="review-stats">
                <div className="stats-summary">
                  <div className="average-rating">{reviewStats.average_rating}</div>
                  <div className="review-rating" style={{ justifyContent: 'center', marginTop: '8px' }}>
                    {renderStars(Math.round(reviewStats.average_rating), 20)}
                  </div>
                  <div className="total-reviews">Based on {reviewStats.total_reviews} reviews</div>
                </div>
                {renderRatingDistribution()}
              </div>
            )}

            <div className="review-filters">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterRating === null ? 'active' : ''}`}
                  onClick={() => handleRatingClick(null)}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button 
                    key={rating}
                    className={`filter-btn ${filterRating === rating ? 'active' : ''}`}
                    onClick={() => handleRatingClick(rating)}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
              <select 
                className="sort-select" 
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-rating">Highest Rated</option>
                <option value="rating">Lowest Rated</option>
                <option value="-helpful_count">Most Helpful</option>
              </select>
            </div>

            {reviewsLoading ? (
              <div className="no-reviews">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <>
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {renderReviewerAvatar(review)}
                        </div>
                        <div className="reviewer-details">
                          <div className="reviewer-name">{review.user_name || 'Anonymous User'}</div>
                          <div className="review-date">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    {review.title && (
                      <div className="review-title-text">{review.title}</div>
                    )}
                    
                    <div className="review-comment">{review.comment}</div>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="review-images-grid">
                        {review.images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="review-image-item"
                            onClick={() => setSelectedImageModal(img)}
                          >
                            <img 
                              src={img} 
                              alt={`Review ${idx + 1}`}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      className={`helpful-btn ${review.is_helpful_by_user ? 'active' : ''}`}
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      <ThumbsUp size={14} />
                      Helpful ({review.helpful_count})
                    </button>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="reviews-pagination">
                    <button 
                      className="page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      className="page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-reviews">
                <div className="no-reviews-icon">
                  <MessageCircle size={40} />
                </div>
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>No reviews yet</h3>
                <p>Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="review-modal-header">
                <h2>Write a Review</h2>
                <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="review-modal-body">
                  <div className="rating-section">
                    <div className="rating-label">Rate {product.name}</div>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={32}
                          fill={star <= (hoverRating || reviewRating) ? '#f0a500' : 'none'}
                          stroke="#f0a500"
                          className="rating-star"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Review Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="Summarize your experience"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      maxLength={200}
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Review *</label>
                    <textarea
                      placeholder="Share your thoughts about this product..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="image-upload-section">
                    <label className="image-upload-label">
                      <Camera size={16} />
                      Upload Photos (Max 5)
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImages}
                      />
                    </label>
                    
                    {uploadingImages && (
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '8px' }}>
                        Uploading...
                      </div>
                    )}

                    {reviewImages.length > 0 && (
                      <div className="image-preview-grid">
                        {reviewImages.map((img, idx) => (
                          <div key={idx} className="image-preview">
                            <img src={img} alt={`Preview ${idx + 1}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(idx)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImageModal && (
          <div className="image-modal" onClick={() => setSelectedImageModal(null)}>
            <img src={selectedImageModal} alt="Full size" />
          </div>
        )}
      </div>
    );
  }

  // ========================
  // REGULAR PRODUCT VIEW
  // ========================
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;

  return (
    <div className="product-detail-wrap">
      <style>{productDetailStyles}</style>
      <style>{reviewSectionStyles}</style>
      <div className="detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>
        
        <div className="product-grid">
          {/* Gallery */}
          <div>
            <div className="gallery-main">
              <img 
                src={product.images?.[selectedImage]?.image || 'https://via.placeholder.com/600x600?text=No+Image'} 
                alt={product.name} 
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button className="nav-btn prev" onClick={() => handleImageNav('prev')}>
                    <ChevronLeft size={20} />
                  </button>
                  <button className="nav-btn next" onClick={() => handleImageNav('next')}>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {product.discount_percentage > 0 && (
                <div className="discount-badge">-{product.discount_percentage}% OFF</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="thumbnails">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumb ${selectedImage === idx ? 'active' : ''}`} 
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img.image} alt={`view ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {renderStars(reviewStats?.average_rating ? Math.round(reviewStats.average_rating) : 0, 14)}
              </div>
              <span className="rating-text">
                ({reviewStats?.total_reviews || 0} {reviewStats?.total_reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="price">
              <span className="current-price">PKR {parseFloat(currentPrice).toFixed(2)}</span>
              {product.compare_price && (
                <span className="old-price">PKR {parseFloat(product.compare_price).toFixed(2)}</span>
              )}
            </div>
            <div className="stock-status">
              {product.in_stock ? (
                <>
                  <Check size={18} style={{ color: '#22c55e' }} />
                  <span className="in-stock">In Stock ({currentStock} available)</span>
                </>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="variant-section">
                <div className="variant-label">Select Variant</div>
                <div className="variant-buttons">
                  {product.variants.map((variant) => (
                    <button 
                      key={variant.id} 
                      className={`variant-btn ${selectedVariant?.id === variant.id ? 'active' : ''}`} 
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.color} {variant.size && `- ${variant.size}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="quantity-section">
              <div className="quantity-label">Quantity</div>
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                >+</button>
              </div>
            </div>
            <div className="action-buttons">
              <button 
                className="btn-cart" 
                onClick={handleAddToCart} 
                disabled={!product.in_stock}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button 
                className={`btn-wishlist ${isInWishlist ? 'wishlisted' : ''}`}
                onClick={handleWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <svg className="spinner-small" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                ) : (
                  <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                )}
              </button>
            </div>
            <div className="trust-badges">
              <div className="trust-item"><Truck size={16} /> Free Shipping</div>
              <div className="trust-item"><ShieldCheck size={16} /> Secure Payment</div>
              <div className="trust-item"><RotateCcw size={16} /> 30-Day Returns</div>
            </div>
          </div>
        </div>
        
        <div className="details-card">
          <div className="details-title">Product Details</div>
          <div className="details-description">{product.description}</div>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">SKU:</span>
              <span className="spec-value">{product.sku}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Category:</span>
              <span className="spec-value">{product.category?.name}</span>
            </div>
            {product.weight && (
              <div className="spec-item">
                <span className="spec-label">Weight:</span>
                <span className="spec-value">{product.weight} kg</span>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <div className="reviews-title">
              <MessageCircle size={24} />
              Customer Reviews
            </div>
            {user && canReview && (
              <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
                <Star size={18} /> Write a Review
              </button>
            )}
          </div>

          {reviewStats && reviewStats.total_reviews > 0 && (
            <div className="review-stats">
              <div className="stats-summary">
                <div className="average-rating">{reviewStats.average_rating}</div>
                <div className="review-rating" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  {renderStars(Math.round(reviewStats.average_rating), 20)}
                </div>
                <div className="total-reviews">Based on {reviewStats.total_reviews} reviews</div>
              </div>
              {renderRatingDistribution()}
            </div>
          )}

          <div className="review-filters">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterRating === null ? 'active' : ''}`}
                onClick={() => handleRatingClick(null)}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button 
                  key={rating}
                  className={`filter-btn ${filterRating === rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(rating)}
                >
                  {rating} ★
                </button>
              ))}
            </div>
            <select 
              className="sort-select" 
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-rating">Highest Rated</option>
              <option value="rating">Lowest Rated</option>
              <option value="-helpful_count">Most Helpful</option>
            </select>
          </div>

          {reviewsLoading ? (
            <div className="no-reviews">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            <>
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {renderReviewerAvatar(review)}
                      </div>
                      <div className="reviewer-details">
                        <div className="reviewer-name">{review.user_name || 'Anonymous User'}</div>
                        <div className="review-date">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  {review.title && (
                    <div className="review-title-text">{review.title}</div>
                  )}
                  
                  <div className="review-comment">{review.comment}</div>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="review-images-grid">
                      {review.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="review-image-item"
                          onClick={() => setSelectedImageModal(img)}
                        >
                          <img 
                            src={img} 
                            alt={`Review ${idx + 1}`}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    className={`helpful-btn ${review.is_helpful_by_user ? 'active' : ''}`}
                    onClick={() => handleHelpfulClick(review.id)}
                  >
                    <ThumbsUp size={14} />
                    Helpful ({review.helpful_count})
                  </button>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="reviews-pagination">
                  <button 
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-reviews">
              <div className="no-reviews-icon">
                <MessageCircle size={40} />
              </div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>No reviews yet</h3>
              <p>Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h2>Write a Review</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="review-modal-body">
                <div className="rating-section">
                  <div className="rating-label">Rate {product.name}</div>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        fill={star <= (hoverRating || reviewRating) ? '#f0a500' : 'none'}
                        stroke="#f0a500"
                        className="rating-star"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Review Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="Summarize your experience"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label>Your Review *</label>
                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                <div className="image-upload-section">
                  <label className="image-upload-label">
                    <Camera size={16} />
                    Upload Photos (Max 5)
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImages}
                    />
                  </label>
                  
                  {uploadingImages && (
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '8px' }}>
                      Uploading...
                    </div>
                  )}

                  {reviewImages.length > 0 && (
                    <div className="image-preview-grid">
                      {reviewImages.map((img, idx) => (
                        <div key={idx} className="image-preview">
                          <img src={img} alt={`Preview ${idx + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(idx)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImageModal && (
        <div className="image-modal" onClick={() => setSelectedImageModal(null)}>
          <img src={selectedImageModal} alt="Full size" />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;