
#include <optional>
#include <functional>
#include <vector>
#include "sugar.hpp"

class Element{
public:
    int value;
    int balance_factor;

    bool operator==(const Element &other) const {
        return self.value == other.value;
    }

    bool operator<(const Element &other) const {
        return self.value < other.value;
    }
};

namespace BinaryTreeRefCommon{
    template <class BinaryTreeRef>
    BinaryTreeRef leftmost(BinaryTreeRef ref){
        while (!ref.is_null()){
            ref = ref.left();
        }
        return ref;
    }
    template <class BinaryTreeRef>
    BinaryTreeRef rightmost(BinaryTreeRef ref){
        while (!ref.is_null()){
            ref = ref.right();
        }
        return ref;
    }
    template <class BinaryTreeRef>
    std::optional<BinaryTreeRef> leftmost_nonnull(BinaryTreeRef ref){
        if (ref.is_null()){
            return std::nullopt;
        }
        while (!ref.left().is_null()){
            ref = ref.left();
        }
        return ref;
    }
    template <class BinaryTreeRef>
    std::optional<BinaryTreeRef> rightmost_nonnull(BinaryTreeRef ref){
        if (ref.is_null()){
            return std::nullopt;
        }
        while (!ref.right().is_null()){
            ref = ref.right();
        }
        return ref;
    }
    template <class BinaryTreeRef>
    Element &ensure_element(BinaryTreeRef ref){
        if (ref.is_null()){
            ref.create();
        }
        return ref.element();
    }
    template <class BinaryTreeRef>
    void iterate(BinaryTreeRef ref, std::function<void(Element)> f){
        if (ref.is_null()){
            return;
        }
        iterate(ref.left(), f);
        f(ref.element());
        iterate(ref.right(), f);
    }
};

class LinkedBinaryTreeNode{
public:
    the<LinkedBinaryTreeNode> left;
    the<LinkedBinaryTreeNode> right;
    Element element;
};

class LinkedBinaryTreeRef{
private:
    std::reference_wrapper<the<LinkedBinaryTreeNode>> root_node;
    std::reference_wrapper<the<LinkedBinaryTreeNode>> node;
public:
    LinkedBinaryTreeRef(the<LinkedBinaryTreeNode> &root_node, the<LinkedBinaryTreeNode> &node)
        : root_node(root_node)
        , node(node)
    {}
    auto &element(){
        return self.node.get()->element;
    }
    auto root(){
        return LinkedBinaryTreeRef(self.root_node, self.root_node);
    }
    auto left(){
        return LinkedBinaryTreeRef(self.root_node, node.get()->left);
    }
    auto right(){
        return LinkedBinaryTreeRef(self.root_node, node.get()->right);
    }
    bool is_null(){
        return self.node.get() == nullptr;
    }
    void create(){
        self.node.get() = std::make_unique<LinkedBinaryTreeNode>();
    }
    void swap(LinkedBinaryTreeRef other){
        self.node.get().swap(other.node.get());
    }
    void remove_self(){
        self.node.get() = nullptr;
    }
    void remove_children(){
        self.node.get()->left = nullptr;
        self.node.get()->right = nullptr;
    }
};

class ArrayBinaryTree{
public:
    std::vector<std::optional<Element>> storage;

    void ensure_index(int index){
        if (self.storage.size() <= index){
            self.storage.resize(index + 1);
        }
    }
};

class ArrayBinaryTreeRef{
private:
    std::reference_wrapper<ArrayBinaryTree> tree;
    int index;
    int left_index(){
        return self.index << 1;
    }
    int right_index(){
        return self.index << 1 | 1;
    }
public:
    ArrayBinaryTreeRef(ArrayBinaryTree &tree, int index)
        : tree(tree)
        , index(index)
    {
        self.tree.get().ensure_index(self.index);
    }
    auto &element(){
        return *self.tree.get().storage[self.index];
    }
    auto root(){
        return ArrayBinaryTreeRef(self.tree, 1);
    }
    auto left(){
        return ArrayBinaryTreeRef(self.tree, self.index << 1);
    }
    auto right(){
        return ArrayBinaryTreeRef(self.tree, self.index << 1 | 1);
    }
    auto is_null(){
        return self.tree.get().storage.size() <= self.index || !bool(self.tree.get().storage[self.index]);
    }
    void create(){
        self.tree.get().storage[self.index] = std::optional(Element());
        self.remove_children();
    }
    void remove_self(){
        self.tree.get().storage[self.index] = std::nullopt;
    }
    void remove_children(){
        self.tree.get().ensure_index(self.right_index());  // ensure children
        self.tree.get().storage[self.left_index()] = std::nullopt;
        self.tree.get().storage[self.right_index()] = std::nullopt;
    }
};
