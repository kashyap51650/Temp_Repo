type NoPagination = {
  mode: "none";
};

type ClientPagination = {
  mode: "client";
  pageSize?: number;
};

type ServerPagination = {
  mode: "server";
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
};

export type PaginationConfig =
  | NoPagination
  | ClientPagination
  | ServerPagination;

export type PaginationState = {
  page: number;
  totalPages: number;
  canNext: boolean;
  canPrev: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
};

export type PaginationData = {
  page: number;
  size: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
};
